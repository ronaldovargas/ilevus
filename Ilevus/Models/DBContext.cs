using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.Models
{
    public class IlevusTableNames
    {
        public const string CitiesTable = "ilevus_cities";
        public const string PicturesTable = "ilevus_pictures";
    }


    public class IlevusDBContext : MongoClient, IDisposable
    {
        public IMongoDatabase IlevusDatabase { get; private set; }

        public static IlevusDBContext Create()
        {
            return new IlevusDBContext("mongodb://localhost:27017");
        }

        private IlevusDBContext(string url) : base(url)
        {
            IlevusDatabase = GetDatabase("ilevus");
        }
        
        public IMongoCollection<IlevusPicture> GetPicturesCollection()
        {
            return IlevusDatabase.GetCollection<IlevusPicture>(IlevusTableNames.PicturesTable);
        }

        public void EnsureIndexes()
        {
            // Criando índice para busca em texto no usuário.
            var pictures = GetPicturesCollection();
            var users = IlevusDatabase.GetCollection<IlevusUser>("users");

            var checksum = Builders<IlevusPicture>.IndexKeys.Ascending(pic => pic.Checksum);
            var unique = new CreateIndexOptions { Unique = true };

            pictures.Indexes.CreateOne(checksum, unique);

            var text = Builders<IlevusUser>.IndexKeys.Combine(
                Builders<IlevusUser>.IndexKeys.Text(u => u.Email),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Name),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Surname),
                Builders<IlevusUser>.IndexKeys.Text(u => u.City),
                Builders<IlevusUser>.IndexKeys.Text(u => u.County),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Country)
            );
            var weights = new BsonDocument();
            weights["Email"] = 10;
            weights["Surname"] = 8;
            weights["Name"] = 6;
            weights["City"] = 4;
            weights["County"] = 2;
            weights["Country"] = 1;
            var textOpts = new CreateIndexOptions<IlevusUser>()
            {
                DefaultLanguage = "portuguese",
                LanguageOverride = "SearchLanguage",
                Name = "UserSearchIndex",
                Weights = weights
            };

            users.Indexes.CreateOne(text, textOpts);
        }

        public void Dispose()
        {
            
        }
    }
}