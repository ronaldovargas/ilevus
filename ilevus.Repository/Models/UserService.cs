using System;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace ilevus.Models
{
	public class UserService
	{
		[BsonId(IdGenerator = typeof(GuidGenerator))]
		public Guid Id { get; set; }
		public string Name { get; set; }
		public double Price { get; set; }
		public double FinalPrice { get; set; }
	}
}