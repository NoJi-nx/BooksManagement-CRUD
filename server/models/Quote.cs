using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Quote
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("Text")]
    public string Text { get; set; }

    [BsonElement("Author")]
    public string Author { get; set; }
}
