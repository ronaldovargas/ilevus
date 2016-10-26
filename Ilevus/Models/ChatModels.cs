using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class ChatConversation
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonDateTimeOptions(DateOnly=true)]
        public DateTime Day { get; set; }

        public string FirstUser { get; set; }
        public string SecondUser { get; set; }
        public List<ChatMessage> Messages { get; set; }

        public ChatConversation()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Messages = new List<ChatMessage>();
            Day = DateTime.Today;
        }
    }

    public class ChatMessage
    {
        public string Content { get; set; }
        public DateTime Creation { get; set; }
        public string AuthorId { get; set; }
        public bool Unread { get; set; }

        public ChatMessage()
        {
            Unread = true;
            Creation = DateTime.Now;
        }
    }

    public class ChatConversationViewModel
    {
        public string Id { get; set; }
        public DateTime Day { get; set; }

        public PublicProfileViewModel Destination { get; set; }
        public IEnumerable<ChatMessage> Messages { get; set; }

        public ChatConversationViewModel(ChatConversation conversation, IlevusUser destination)
        {
            Id = conversation.Id;
            Messages = conversation.Messages;
            Day = conversation.Day;
            Destination = new PublicProfileViewModel(destination);
        }
    }

    public class ChatMessageBindingModel
    {
        public string Content { get; set; }
        public string Destination { get; set; }
    }
}