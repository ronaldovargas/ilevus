using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class SiteMapLogModel
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public DateTime DataGeracao { get; set; }
        public int UsuariosVerificados { get; set; }
        public int UsuariosIncluidosArquivos { get; set; }

        public SiteMapLogModel()
        {
            Id = ObjectId.GenerateNewId().ToString();
            DataGeracao = DateTime.Now;
            UsuariosVerificados = 0;
            UsuariosIncluidosArquivos = 0;
        }
    }
}