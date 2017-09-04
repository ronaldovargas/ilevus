using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
   
    public class AssessmentModel
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Rating { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime Data { get; set; }
        public string Programa { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string Avaliador { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string Avaliado { get; set; }
        public IlevusUser DadosAvaliado { get; set; }
        public IlevusUser DadosAvaliador { get; set; }
        public int? MediaRating { get; set; }

        public AssessmentModel()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Rating = string.Empty;
            Titulo = string.Empty;
            Descricao = string.Empty;
            Data = DateTime.Now;
            Programa = string.Empty;
            Avaliador = string.Empty;
            Avaliado = string.Empty;
            MediaRating = 0;
        }
    }
}