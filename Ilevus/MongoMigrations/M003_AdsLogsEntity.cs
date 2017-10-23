using CSharpMongoMigrations;
using ilevus.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.MongoMigrations
{
    [Migration(3, "Adicionando Collection dos Logs de Anúncios")]
    public class M003_AdsLogsEntity : Migration
    {
        public M003_AdsLogsEntity()
        {
        }

        public override void Up()
        {
            var collection = GetCollection("ilevus_ads_log");
            var document = new BsonDocument();

            document.AddUniqueIdentifier(new Guid("06BFFCF5-DAE9-422A-85AB-F58DE41E86DA"));
            document.AddProperty("user_id", "");
            document.AddProperty("user_nome", "Administrador");
            document.AddProperty("user_email", "admin@ilevus.com");
            document.AddProperty("ad_id", "");
            document.AddProperty("status", "Approved");
            document.AddProperty("date", DateTime.Now);

            collection.InsertOne(document);
        }

        public override void Down()
        {
            //var collection = GetCollection("ilevus_ads_log");
            //var idFilter = Builders<BsonDocument>.Filter.Eq("_id", new Guid("06BFFCF5-DAE9-422A-85AB-F58DE41E86DA"));
            //collection.DeleteOne(idFilter);
        }

        private void RemoveField(string fieldName)
        {
            var collection = GetCollection(IlevusTableNames.AdsLogTable);
            FieldDefinition<BsonDocument> field = fieldName;
            var filter = Builders<BsonDocument>.Filter.Exists(field);
            var update = Builders<BsonDocument>.Update.Unset(field);
            collection.UpdateMany(filter, update);
        }

    }
}