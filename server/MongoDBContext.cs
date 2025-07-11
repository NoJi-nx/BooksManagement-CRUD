using MongoDB.Driver;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"];
        var client = new MongoClient(connectionString);
        
        _database = client.GetDatabase(configuration["MongoDB:DatabaseName"]);
        
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
    {
        return _database.GetCollection<T>(collectionName);
    }

    

    public IMongoCollection<Book> Books => _database.GetCollection<Book>("Books");
public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
public IMongoCollection<Quote> Quotes => GetCollection<Quote>("Quotes");
}