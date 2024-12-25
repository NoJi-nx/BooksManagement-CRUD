using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

// Load environment variables
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel for HTTP/HTTPS
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5239); // HTTP
    options.ListenLocalhost(7136);
});

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddAuthorization(); // Add this line for authorization
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "https://book-management-crud.com",
        ValidAudience = "https://book-management-crud.com",
        IssuerSigningKey = new SymmetricSecurityKey(
            Convert.FromBase64String(Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ??
                                     throw new Exception("JWT_SECRET_KEY not found or invalid."))
        )
    };
});

var app = builder.Build();

// JWT Token Generator
string GenerateJwtToken(string userId)
{
    var key = Convert.FromBase64String(Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
            ?? throw new Exception("JWT_SECRET_KEY not found or invalid."));
Console.WriteLine("Decoded Key Length: " + key.Length * 8 + " bits");
    
    var symmetricKey = new SymmetricSecurityKey(key);
    var credentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, userId),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: "https://book-management-crud.com",
        audience: "https://book-management-crud.com",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




app.MapGet("/", () => "Welcome to the Books Management API");

app.MapGet("/api/books", async (MongoDbContext db, ILogger<Program> logger) =>
{
    logger.LogInformation("Request received for /api/books");
    var books = await db.Books.Find(_ => true).ToListAsync();
    return Results.Ok(books);
});

app.MapGet("/api/db-check", (MongoDbContext db) =>
{
    return db.Books.Database.Client.Cluster.Description.State.ToString();
});

app.MapPost("/api/books", async (MongoDbContext db, Book book) =>
{
    await db.Books.InsertOneAsync(book);
    return Results.Created($"/api/books/{book.Id}", book);
});

app.MapPut("/api/books/{id}", async (string id, Book updatedBook, MongoDbContext db) =>
{
   Console.WriteLine($"Incoming Book: {JsonSerializer.Serialize(updatedBook)}");

    // Check for null fields in the updatedBook object
    if (string.IsNullOrEmpty(updatedBook.Title) ||
        string.IsNullOrEmpty(updatedBook.Author) ||
       updatedBook.PublicationDate == DateTime.MinValue)
    {
        return Results.BadRequest("Invalid book data. Please check your input.");
    }

    var filter = Builders<Book>.Filter.Eq(book => book.Id, id);

    var existingBook = await db.Books.Find(filter).FirstOrDefaultAsync();

    if (existingBook == null)
        return Results.NotFound($"Book with ID {id} not found.");

    // Preserve the _id field
    updatedBook.Id = existingBook.Id;

    var result = await db.Books.ReplaceOneAsync(filter, updatedBook);

    return Results.Ok(updatedBook);

    
});

app.MapPatch("/api/books/{id}", async (string id, JsonElement partialUpdate, MongoDbContext db) =>
{
    var updateDefinition = Builders<Book>.Update.Combine();

    if (partialUpdate.TryGetProperty("title", out var title))
    {
        updateDefinition = updateDefinition.Set(b => b.Title, title.GetString());
    }
    if (partialUpdate.TryGetProperty("author", out var author))
    {
        updateDefinition = updateDefinition.Set(b => b.Author, author.GetString());
    }

    var result = await db.Books.UpdateOneAsync(b => b.Id == id, updateDefinition);

    if (result.ModifiedCount == 0)
    {
        return Results.NotFound("Book not found or no changes applied.");
    }

    return Results.Ok("Book updated successfully.");
});

app.MapDelete("/api/books/{id}", async (string id, MongoDbContext db) =>
{
    var filter = Builders<Book>.Filter.Eq(book => book.Id, id);
    var result = await db.Books.DeleteOneAsync(filter);

    if (result.DeletedCount == 0)
        return Results.NotFound($"Book with ID {id} not found.");

    return Results.Ok($"Book with ID {id} deleted successfully.");
});

app.MapPost("/api/users/register", async (User user, MongoDbContext dbContext) =>
{
    Console.WriteLine("Incoming registration request:");
    Console.WriteLine($"Username: {user.Username}");
    Console.WriteLine($"Password provided: {user.Password}");

    // Validate input
    if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
    {
        Console.WriteLine("Invalid registration input: Username or password is missing.");
        return Results.BadRequest("Username and password are required.");
    }

    // Check if user already exists
    var existingUser = await dbContext.Users.Find(u => u.Username == user.Username).FirstOrDefaultAsync();
    if (existingUser != null)
    {
        Console.WriteLine("User already exists.");
        return Results.BadRequest("Username already exists.");
    }

    // Hash the password
    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
    Console.WriteLine($"Generated Password Hash: {user.PasswordHash}");

    // Insert user into the database
    await dbContext.Users.InsertOneAsync(user);
    Console.WriteLine("User registered successfully.");

    return Results.Ok("User registered successfully.");
});

app.MapPost("/api/users/login", async (User user, MongoDbContext dbContext) =>
{
    Console.WriteLine("Incoming login request:");
    Console.WriteLine($"Username: {user.Username}");
    Console.WriteLine($"Password provided: {user.Password}");

    // Find the user in the database
    var existingUser = await dbContext.Users.Find(u => u.Username == user.Username).FirstOrDefaultAsync();

    if (existingUser == null)
    {
        Console.WriteLine("User not found.");
        return Results.BadRequest("Invalid username or password.");
    }

    Console.WriteLine($"User found in DB: Username={existingUser.Username}");
    Console.WriteLine($"Password hash in DB: {existingUser.PasswordHash}");

    // Verify the password
    if (!BCrypt.Net.BCrypt.Verify(user.Password, existingUser.PasswordHash))
    {
        Console.WriteLine("Password verification failed.");
        return Results.BadRequest("Invalid username or password.");
    }

    Console.WriteLine("Password verified. Generating JWT token...");

    // Generate the JWT token
    var token = GenerateJwtToken(existingUser.Id);
    Console.WriteLine($"Generated Token: {token}");

    return Results.Ok(new { Token = token });
});

// Get all users
app.MapGet("/api/users", async (MongoDbContext dbContext) =>
{
    var users = await dbContext.Users
        .Find(_ => true)
        .Project(u => new { u.Id, u.Username }) // Exclude sensitive data
        .ToListAsync();
    return Results.Ok(users);
})
.WithName("GetAllUsers")
.RequireAuthorization(); // Add this if you want to restrict access to authenticated users

// Get user by ID
app.MapGet("/api/users/{id}", async (string id, MongoDbContext dbContext) =>
{
    var user = await dbContext.Users.Find(u => u.Id == id).FirstOrDefaultAsync();

    if (user == null)
    {
        return Results.NotFound($"User with ID {id} not found.");
    }

    return Results.Ok(new { user.Id, user.Username }); // Exclude sensitive data
})
.WithName("GetUserById")
.RequireAuthorization(); // Add this if needed

// Delete a user
app.MapDelete("/api/users/{id}", async (string id, MongoDbContext dbContext) =>
{
    var result = await dbContext.Users.DeleteOneAsync(u => u.Id == id);

    if (result.DeletedCount == 0)
    {
        return Results.NotFound($"User with ID {id} not found.");
    }

    return Results.Ok($"User with ID {id} deleted successfully.");
})
.WithName("DeleteUser")
.RequireAuthorization(); // Add this if you want to restrict access to authenticated users

// Update user details
app.MapPut("/api/users/{id}", async (string id, User updatedUser, MongoDbContext dbContext) =>
{
    var filter = Builders<User>.Filter.Eq(u => u.Id, id);
    var updateDefinition = Builders<User>.Update
        .Set(u => u.Username, updatedUser.Username);

    // Add more fields to update as needed

    var result = await dbContext.Users.UpdateOneAsync(filter, updateDefinition);

    if (result.ModifiedCount == 0)
    {
        return Results.NotFound($"User with ID {id} not found or no changes applied.");
    }

    return Results.Ok("User updated successfully.");
})
.WithName("UpdateUser")
.RequireAuthorization(); // Add this if needed

app.MapGet("/weatherforecast", () =>
{
     var summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();
app.UseRouting(); // Add routing first
app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

