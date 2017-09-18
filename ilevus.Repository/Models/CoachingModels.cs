using ilevus.Models.CoachingTools;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoRepository;

namespace ilevus.Models
{
    public class CoachingProcess : IEntity
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string CoachId { get; set; }
        public string CoacheeId { get; set; }
        public DateTime Creation { get; set; }
        public DateTime Started { get; set; }
        public DateTime Finished { get; set; }
        public DateTime LastModified { get; set; }

        public string Objectives { get; set; }
        public string CoachComments { get; set; }
        public string CoacheeComments { get; set; }
        public string Testimony { get; set; }

        public int Status { get; set; }
        public double Rating { get; set; }

        public List<CoachingSession> Sessions { get; set; }
        public List<CoachingProcessStep> Steps { get; set; }

        public CoachingProcess()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Creation = DateTime.Now;
            LastModified = DateTime.Now;
            Sessions = new List<CoachingSession>();
            Steps = null;
            Status = 0;
        }
    }

    public class CoachingSession
    {
        public string Objectives { get; set; }
        public List<string> Tags { get; set; }
        public string CoachComments { get; set; }
        public string CoacheeComments { get; set; }

        public int ProcessStep { get; set; }
        public int Status { get; set; }
        public double Rating { get; set; }
        public double Commitment { get; set; }

        public DateTime Creation { get; set; }
        public DateTime Started { get; set; }
        public DateTime Finished { get; set; }

        public WheelOfLife WheelOfLifeTool { get; set; }

        public CoachingSession()
        {
            Creation = DateTime.Now;
            ProcessStep = 0;
            Status = 0;
            Tags = new List<string>();
        }
    }

    public class CoachingProcessStep
    {
        public string Label { get; set; }
        public string Color { get; set; }
    }
}