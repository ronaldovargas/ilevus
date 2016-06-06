using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    [DynamoDBTable(IlevusTableNames.PicturesTable)]
    public class IlevusPicture
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }
        [DynamoDBRangeKey]
        public string Checksum { get; set; }

        public DateTime Creation { get; set; }
        public string Mime { get; set; }
        public string OriginalName { get; set; }

        public IlevusPicture()
        {
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