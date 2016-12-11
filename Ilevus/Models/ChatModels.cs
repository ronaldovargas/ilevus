using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
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

    public class ChatContactsViewModel
    {
        public List<ChatContact> Contacts { get; set; }
        public ChatContactsViewModel(List<ChatConversation> conversations, string owner, IMongoCollection<IlevusUser> users)
        {
            Contacts = new List<ChatContact>();
            if (conversations != null && conversations.Count > 0)
            {
                var filters = Builders<IlevusUser>.Filter;
                foreach (var conversation in conversations)
                {
                    var id = conversation.FirstUser.Equals(owner) ? conversation.SecondUser : conversation.FirstUser;
                    var partner = users.FindSync(
                        filters.Eq("Id", id)
                    ).FirstOrDefault();
                    if (partner != null)
                    {
                        Contacts.Add(new ChatContact() {
                            PartnerId = partner.Id,
                            PartnerImage = partner.Image,
                            PartnerName = partner.Name,
                            PartnerSurname = partner.Surname,
                            CreationDay = conversation.Day,
                            LastMessage = conversation.Messages.LastOrDefault()
                        });
                    }
                }

                // Ordenando contatos
                Contacts.Sort(delegate (ChatContact c1, ChatContact c2) {
                    if (c1.LastMessage == null && c2.LastMessage == null)
                    {
                        return c2.CreationDay.CompareTo(c1.CreationDay);
                    }
                    if (c1.LastMessage == null)
                    {
                        return -1;
                    }
                    if (c2.LastMessage == null)
                    {
                        return 1;
                    }
                    return c2.LastMessage.Creation.CompareTo(c1.LastMessage.Creation);
                });
            }
        }
    }

    public class ChatContact
    {
        public string PartnerId { get; set; }
        public string PartnerImage { get; set; }
        public string PartnerName { get; set; }
        public string PartnerSurname { get; set; }
        public DateTime CreationDay { get; set; }
        public ChatMessage LastMessage { get; set; }
        
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