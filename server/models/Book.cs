using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Title { get; set; }

    public string Author { get; set; }

    public DateTime PublicationDate { get; set; }

    [BsonElement("UserId")]
    public string UserId { get; set; } // ID of the user who owns the book
}
