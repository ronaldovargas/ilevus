using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CSharpMongoMigrations;
using ilevus.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ilevus.Migrations
{
	[Migration(0, "Add John Doe")]
	public class M001_UserProfessionalEntity : Migration
	{
		public M001_UserProfessionalEntity()
		{
		}

		public override void Up()
		{
			RemoveField("Financial");
			RemoveField("Professional.BirthDate");
			RemoveField("Professional.StreetNumber");
			RemoveField("Professional.Financial");
			RemoveField("Professional.Phone");
			RemoveField("Professional.BankAccount");
		}

		public override void Down()
		{
			//	var doors = document["Phone"].ToBsonDocument();
			//	document.Remove("Phone");
			//	document.Add("Phone", doors["Number"].ToString()
		}


		private void RemoveField(string fieldName)
		{
			var collection = GetCollection(IlevusTableNames.UsersTable);
			FieldDefinition<BsonDocument> field = fieldName;
			var filter = Builders<BsonDocument>.Filter.Exists(field);
			var update = Builders<BsonDocument>.Update.Unset(field);
			collection.UpdateMany(filter, update);
		}
	}

	//[Migration(1, "Add John Doe")]
	//public class M002_UserProfessionalEntity : Migration
	//{
	//	public override void Up()
	//	{
	//		var collection = GetCollection(IlevusTableNames.UsersTable);
	//		var document = new BsonDocument();

	//		document.AddUniqueIdentifier(new Guid("06BFFCF5-DAE9-422A-85AB-F58DE41E86DA"));
	//		document.AddProperty("Name", "John Doe");

	//		collection.InsertOne(document);

	//		//var doors = document["Phone"].ToBsonDocument();
	//		//document.Remove("Phone");
	//		//document.Add("Phone", doors["Number"].ToString());
	//	}

	//	public override void Down()
	//	{
	//		//	var doors = document["Phone"].ToBsonDocument();
	//		//	document.Remove("Phone");
	//		//	document.Add("Phone", doors["Number"].ToString()
	//	}


	//	private void RemoveField(string fieldName)
	//	{
	//		var collection = GetCollection(IlevusTableNames.UsersTable);
	//		FieldDefinition<BsonDocument> field = fieldName;
	//		var filter = Builders<BsonDocument>.Filter.Exists(field);
	//		var update = Builders<BsonDocument>.Update.Unset(field);
	//		collection.UpdateMany(filter, update);
	//	}
	//}
}