using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class IlevusSubscription
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserId { get; set; }
        public int Amount { get; set; }

        public string MoipId { get; set; }
        public string MoipAccount { get; set; }
        public MoipInvoice Invoice { get; set; }
        public MoipDateTime MoipCreation { get; set; }
        public MoipDate NextInvoiceDate { get; set; }
        
        public string Status;
        public MoipCreditCard CreditCard { get; set; }

        public DateTime Creation { get; set; }

        public IlevusSubscription()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Creation = DateTime.Now;
        }
    }

    public class MoipCreditCard
    {
        public string first_six_digits { get; set; }
        public string last_four_digits { get; set; }
        public string expiration_year { get; set; }
        public string expiration_month { get; set; }
        public string holder_name { get; set; }
        public string brand { get; set; }
        public string vault { get; set; }
    }

    public class MoipInvoice
    {
        public int amount { get; set; }
        public int id { get; set; }
        public MoipInvoiceStatus status { get; set; }
    }

    public class MoipInvoiceStatus
    {
        public int code { get; set; }
        public string description { get; set; }
    }

    public class MoipPlan
    {
        public string code { get; set; }
        public string id { get; set; }
        public string name { get; set; }
    }

    public class MoipDate
    {
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }
    }

    public class MoipDateTime
    {
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }
        public int hour { get; set; }
        public int minute { get; set; }
        public int second { get; set; }
    }
    
}