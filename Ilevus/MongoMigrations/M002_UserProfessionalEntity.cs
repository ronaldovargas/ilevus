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
	[Migration(1, "Removendo MoipAccount")]
	public class M002_UserProfessionalEntity : Migration
	{
		public M002_UserProfessionalEntity()
		{
		}

		public override void Up()
		{
			RemoveField("Professional.MoipAccount");
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
}