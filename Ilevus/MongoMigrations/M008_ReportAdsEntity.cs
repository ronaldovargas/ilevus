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
    [Migration(8, "Criação da Collection Re relatório dos Anúncios")]
    public class M008_ReportAdsEntity : Migration
    {
        public M008_ReportAdsEntity()
        {
        }

        public override void Up()
        {
            var collection = GetCollection(IlevusTableNames.AdsReport);
            var document = new BsonDocument();
            
            document.AddProperty("ad_id", "");
            document.AddProperty("date", "");
            document.AddProperty("ad_event", "");
            document.AddProperty("cost", "");

            collection.InsertOne(document);

            /*InsertField("date", "");
            InsertField("ad", "");
            InsertField("event", "");
            InsertField("cost", "");*/

            var filter = Builders<BsonDocument>.Filter;
            collection.DeleteMany(filter.Empty);

        }

        public override void Down()
        {
            //var collection = GetCollection("ilevus_ads_log");
            //var idFilter = Builders<BsonDocument>.Filter.Eq("_id", new Guid("06BFFCF5-DAE9-422A-85AB-F58DE41E86DA"));
            //collection.DeleteOne(idFilter);
        }

        private void RemoveField(string fieldName)
        {
            //var collection = GetCollection(IlevusTableNames.AdsLogTable);
            //FieldDefinition<BsonDocument> field = fieldName;
            //var filter = Builders<BsonDocument>.Filter.Not(Builders<BsonDocument>.Filter.Exists(field));
            //var update = Builders<BsonDocument>.Update.Unset(field);
            //collection.UpdateMany(filter, update);
        }

        private void InsertField(string fieldName, string fieldValue)
        {
            var collection = GetCollection(IlevusTableNames.AdsReport);
            FieldDefinition<BsonDocument> field = fieldName;
            var filter = Builders<BsonDocument>.Filter.Not(Builders<BsonDocument>.Filter.Exists(field));
            var update = Builders<BsonDocument>.Update.Set(fieldName, fieldValue);
            collection.UpdateMany(filter, update);
        }
    }
}