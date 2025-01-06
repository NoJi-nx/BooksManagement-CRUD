using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for all endpoints
public class BooksController : ControllerBase
{
    private readonly IMongoCollection<Book> _booksCollection;

    public BooksController(MongoDbContext context)
    {
        _booksCollection = context.Books;
    }

private string GetUserId()
{
    var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) 
              ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

    Console.WriteLine($"Extracted UserId from Token: {userId}");
    if (string.IsNullOrEmpty(userId))
        throw new UnauthorizedAccessException("User ID not found in token.");

    return userId;
}

[HttpGet("test-userid")]
public IActionResult TestUserId()
{
    try
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) 
                     ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token.");
        }

        return Ok(new { UserId = userId });
    }
    catch (Exception ex)
    {
        return BadRequest(new { Error = ex.Message });
    }
}

    // GET: /api/books
    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var userId = GetUserId();
        var books = await _booksCollection.Find(book => book.UserId == userId).ToListAsync();
        return Ok(books);
    }

    // POST: /api/books
[HttpPost]
[HttpPost]
public async Task<IActionResult> AddBook([FromBody] Book book)
{
    if (book == null)
        return BadRequest("Book cannot be null");

    var userId = GetUserId();
    if (string.IsNullOrEmpty(userId))
        return Unauthorized("User ID not found in token");

    // Set UserId
    book.UserId = userId;

    Console.WriteLine($"Adding Book: {book.Title}, UserId: {book.UserId}");

    await _booksCollection.InsertOneAsync(book);
    return CreatedAtAction(nameof(GetBooks), new { id = book.Id }, book);
}

    // PUT: /api/books/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(string id, [FromBody] Book updatedBook)
    {
        var userId = GetUserId();
        var book = await _booksCollection.Find(b => b.Id == id && b.UserId == userId).FirstOrDefaultAsync();
        if (book == null)
            return NotFound("Book not found or you do not have access to it.");

        updatedBook.UserId = userId; //Ensure the UserId is preserved
        await _booksCollection.ReplaceOneAsync(b => b.Id == id, updatedBook);
        return NoContent();
    }

    // DELETE: /api/books/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(string id)
    {
        var userId = GetUserId();
        var result = await _booksCollection.DeleteOneAsync(b => b.Id == id && b.UserId == userId);
        if (result.DeletedCount == 0)
            return NotFound("Book not found or you do not have access to it.");

        return NoContent();
    }
}


