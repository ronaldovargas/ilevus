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
    [Migration(7, "Adicionando campo de \"Nome da Campanha\" na Collection de Anúncios")]
    public class M007_AdsEntity : Migration
    {
        public M007_AdsEntity()
        {
        }

        public override void Up()
        {
            InsertField("Campaign", "");

            //var collection = GetCollection(IlevusTableNames.AdsTable);
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var Ads = db.GetAdsCollection();

            var results = Ads.Find(filters.Empty);
            var ads = results.ToList();
            if (ads != null)
            {
                foreach (var item in ads)
                {
                    var updates = Builders<Ad>.Update;
                    Ads.UpdateOneAsync(
                        filters.Eq("Id", item.Id),
                        updates.Combine(
                            updates.Set("Campaign", item.Headline)
                        )

                    );
                }
            }

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
            var collection = GetCollection(IlevusTableNames.AdsTable);
            FieldDefinition<BsonDocument> field = fieldName;
            var filter = Builders<BsonDocument>.Filter.Not(Builders<BsonDocument>.Filter.Exists(field));
            var update = Builders<BsonDocument>.Update.Set(fieldName, fieldValue);
            collection.UpdateMany(filter, update);
        }
    }
}