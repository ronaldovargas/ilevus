using CSharpMongoMigrations;
using ilevus.Models;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.MongoMigrations
{
    [Migration(6, "Adicionando Collection do Saldo dos Anúncios")]
    public class M006_BalanceEntity : Migration
    {
        public M006_BalanceEntity()
        {
        }

        public override void Up()
        {
            var collection = GetCollection(IlevusTableNames.AdsBalanceTable);
            var document = new BsonDocument();

            document.AddProperty("Balance", "150.0");

            collection.InsertOne(document);
        }

        public override void Down()
        {
        }

        private void RemoveField(string fieldName)
        {
        }
    }
}