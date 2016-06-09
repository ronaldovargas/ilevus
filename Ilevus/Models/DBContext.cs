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


    public class IlevusDBContext : MongoClient
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
    }
}