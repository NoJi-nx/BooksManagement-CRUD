using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IMongoCollection<Book> _booksCollection;

    public BooksController(MongoDbContext context)
    {
        _booksCollection = context.Books;
    }

    // GET: /api/books
    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _booksCollection.Find(book => true).ToListAsync();
        return Ok(books);
    }

    // POST: /api/books
    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] Book book)
    {
        if (book == null)
            return BadRequest("Book cannot be null");

        await _booksCollection.InsertOneAsync(book);
        return CreatedAtAction(nameof(GetBooks), new { id = book.Id }, book);
    }

    // PUT: /api/books/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(string id, [FromBody] Book updatedBook)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null)
            return NotFound();

        await _booksCollection.ReplaceOneAsync(b => b.Id == id, updatedBook);
        return NoContent();
    }

    // DELETE: /api/books/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(string id)
    {
        var result = await _booksCollection.DeleteOneAsync(b => b.Id == id);
        if (result.DeletedCount == 0)
            return NotFound();

        return NoContent();
    }
}