using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class CoachingProcess
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
        public string CoachComments { get; set; }
        public string CoacheeComments { get; set; }

        public int ProcessStep { get; set; }
        public int Status { get; set; }
        public double Rating { get; set; }
        public double Commitment { get; set; }

        public DateTime Creation { get; set; }
        public DateTime Started { get; set; }
        public DateTime Finished { get; set; }

        public CoachingSession()
        {
            Creation = DateTime.Now;
            ProcessStep = 0;
            Status = 0;
        }
    }

    public class CoachingProcessStep
    {
        public string Label { get; set; }
        public string Color { get; set; }
    }


    public class CoachingProcessViewModel
    {
        public string Id { get; set; }

        public PublicProfileViewModel Coach { get; set; }
        public PublicProfileViewModel Coachee { get; set; }
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

        public CoachingProcessViewModel(CoachingProcess process, IlevusUser coach, IlevusUser coachee)
        {
            Id = process.Id;
            CoachComments = process.CoachComments;
            CoacheeComments = process.CoacheeComments;
            Creation = process.Creation;
            Started = process.Started;
            Finished = process.Finished;
            LastModified = process.LastModified;
            Objectives = process.Objectives;
            Testimony = process.Testimony;
            Rating = process.Rating;
            Status = process.Status;
            Sessions = process.Sessions;
            Steps = process.Steps;
            Coach = new PublicProfileViewModel(coach);
            Coachee = new PublicProfileViewModel(coachee);
        }
    }

    public class CoachingSessionFieldUpdateBindingModel
    {
        public string ProcessId { get; set; }
        public string Field { get; set; }
        public string Value { get; set; }
        public int Session { get; set; }
    }

    public class ChangeSessionProcessStepBindingModel
    {
        public string Id { get; set; }
        public int Session { get; set; }
        public int Step { get; set; }
    }

    public class EvaluateSessionBindingModel
    {
        public string Id { get; set; }
        public int Session { get; set; }
        public double Rating { get; set; }
        public double Commitment { get; set; }
    }
}