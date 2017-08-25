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
        public string Data { get; set; }
        public string Programa { get; set; }
        public string Avaliador { get; set; }
        public string Avaliado { get; set; }

        public AssessmentModel()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Rating = string.Empty;
            Titulo = string.Empty;
            Descricao = string.Empty;
            Data = DateTime.Now.ToString("dd/MM/yyyy HH:mm");
            Programa = string.Empty;
            Avaliador = string.Empty;
            Avaliado = string.Empty;
        }
    }
}