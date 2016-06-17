using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class IlevusPicture
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Checksum { get; set; }

        public string UserId { get; set; }

        public DateTime Creation { get; set; }
        public string Mime { get; set; }
        public string OriginalName { get; set; }

        public IlevusPicture()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Creation = DateTime.Now;
        }
    }

    public class IlevusBlobHelper
    {
        protected const string PicturesStoragePath = "~/App_Data/pictures/";

        public static string GetPictureUrl(HttpServerUtility server, string checksum)
        {
            return server.MapPath(PicturesStoragePath + checksum + ".bin");
        }
    }
}