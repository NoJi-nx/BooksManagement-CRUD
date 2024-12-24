using MongoDB.Driver;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5239); // HTTP
    options.ListenLocalhost(7136, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MongoDbContext>();

var app = builder.Build();

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

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
