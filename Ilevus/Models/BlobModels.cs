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
        protected static readonly List<string> _mimes = new List<string> {
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/gif"
        };
        protected static readonly int _maxSize = 2048*1024;

        public static bool isValidMimeType(string mime)
        {
            return _mimes.Contains(mime);
        }
        public static bool isValidSize(int bytes)
        {
            return bytes <= _maxSize;
        }

        public static string GetPictureUrl(HttpServerUtility server, string checksum)
        {
            return server.MapPath(PicturesStoragePath + checksum + ".bin");
        }
    }
}