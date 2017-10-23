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
    [Migration(5, "Adicionando Collection das Definições do Sistema")]
    public class M005_Definitions : Migration
    {
        public M005_Definitions()
        {
        }

        public override void Up()
        {
            var collection = GetCollection("ilevus_definitions");
            var document = new BsonDocument();

            /*IlevusDBContext.SystemDefinitions.definitions = "{\"PathAds\" : \"\", " +
                 "\"AdsMaxSize\" : \"\", " +
                 "\"CostPerClick_pt_br\" : \"\", " +
                 "\"CostPerView_pt_br\" : \"\", " +
                 "\"CostPerClick_en\" : \"\", " +
                 "\"CostPerView_en\" : \"\", " +
                 "\"CostPerClick_es\" : \"\", " +
                 "\"CostPerView_es\" : \"\"}";*/

            //document.AddUniqueIdentifier(ObjectId.GenerateNewId().ToString());
            //document.AddProperty("_id", ObjectId.GenerateNewId());
            document.AddProperty("definitions", "{\"PathAds\" : \"\", \"UrlRetriviedAds\" : \"\", \"AdsMaxSize\" : \"\", \"CostPerClick_pt_br\" : \"0\", \"CostPerView_pt_br\" : \"0\", \"CostPerClick_en\" : \"0\", \"CostPerView_en\" : \"0\", \"CostPerClick_es\" : \"0\", \"CostPerView_es\" : \"0\"}");

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