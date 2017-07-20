using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Resources;
using System.Threading.Tasks;
using ilevus.Helpers;
using ilevus.Resources;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ilevus.Models
{
    public class IlevusTableNames
    {
        public const string AdsTable = "ilevus_ads";
        public const string CitiesTable = "ilevus_cities";
        public const string CoachingProcessTable = "ilevus_coaching_process";
        public const string ConversationsTable = "ilevus_conversations";
        public const string MeetingScheduleTable = "ilevus_meeting_schedule";
        public const string PicturesTable = "ilevus_pictures";
        public const string SubscriptionsTable = "ilevus_subscriptions";
        public const string SystemConfigTable = "ilevus_system";
        public const string SystemMessagesTable = "ilevus_messages";
        public const string UsersTable = "users";
        public const string NotificationsTable = "notifications";
    }


    public class IlevusDBContext : MongoClient, IDisposable
    {
        public IMongoDatabase IlevusDatabase { get; private set; }
        public static SystemConfig SystemConfiguration { get; private set; }
        public static IDictionary<string, SystemMessages> Messages { get; private set; }

        public static IlevusDBContext Create()
        {
            return new IlevusDBContext("mongodb://localhost:27017");
        }

        private IlevusDBContext(string url) : base(url)
        {
            IlevusDatabase = GetDatabase("ilevus");
        }

        public IMongoCollection<Ad> GetAdsCollection()
        {
            return IlevusDatabase.GetCollection<Ad>(IlevusTableNames.AdsTable);
        }

        public IMongoCollection<CoachingProcess> GetCoachingProcessCollection()
        {
            return IlevusDatabase.GetCollection<CoachingProcess>(IlevusTableNames.CoachingProcessTable);
        }

        public IMongoCollection<ChatConversation> GetConversationsCollection()
        {
            return IlevusDatabase.GetCollection<ChatConversation>(IlevusTableNames.ConversationsTable);
        }

        public IMongoCollection<MeetingSchedule> GetMeetingScheduleCollection()
        {
            return IlevusDatabase.GetCollection<MeetingSchedule>(IlevusTableNames.MeetingScheduleTable);
        }

        public IMongoCollection<IlevusPicture> GetPicturesCollection()
        {
            return IlevusDatabase.GetCollection<IlevusPicture>(IlevusTableNames.PicturesTable);
        }

        public IMongoCollection<IlevusSubscription> GetSubscriptionsCollection()
        {
            return IlevusDatabase.GetCollection<IlevusSubscription>(IlevusTableNames.SubscriptionsTable);
        }

        public IMongoCollection<IlevusUser> GetUsersCollection()
        {
            return IlevusDatabase.GetCollection<IlevusUser>(IlevusTableNames.UsersTable);
        }

        public IMongoCollection<NotificationModel> GetNotificationsCollection()
        {
            return IlevusDatabase.GetCollection<NotificationModel>(IlevusTableNames.NotificationsTable);
        }

        public async Task<bool> UpdateSystemConfig()
        {
            var configCollection = IlevusDatabase.GetCollection<SystemConfig>(IlevusTableNames.SystemConfigTable);
            var result = await configCollection.ReplaceOneAsync(FilterDefinition<SystemConfig>.Empty, SystemConfiguration);
            if (result.MatchedCount > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> AddSystemMessagesKey(string key)
        {
            var ptBR = Messages["pt-br"];
            var en = Messages["en"];
            var es = Messages["es"];
            SystemLabel label;
            try
            {
                label = ptBR.Messages[key];
            }
            catch (KeyNotFoundException ex)
            {
                ptBR.Add(key, new SystemLabel()
                {
                    Content = "???" + key + "???",
                    New = true,
                    Reviewed = false
                });
            }
            try
            {
                label = en.Messages[key];
            }
            catch (KeyNotFoundException ex)
            {
                en.Add(key, new SystemLabel()
                {
                    Content = "???" + key + "???",
                    New = true,
                    Reviewed = false
                });
            }
            try
            {
                label = es.Messages[key];
            }
            catch (KeyNotFoundException ex)
            {
                es.Add(key, new SystemLabel()
                {
                    Content = "???" + key + "???",
                    New = true,
                    Reviewed = false
                });
            }

            return await SaveSystemMessages();
        }

        public async Task<bool> ReviewSystemMessagesKey(string key, string lang)
        {
            var msgs = Messages[lang];
            SystemLabel label;
            try
            {
                label = msgs.Messages[key];
                label.Reviewed = true;
                label.New = false;
            }
            catch (KeyNotFoundException ex)
            {
                return false;
            }
            
            return await SaveSystemMessages();
        }

        public async Task<bool> UpdateSystemMessage(MessageBindingModel model)
        {
            var msgs = Messages[model.Lang];
            SystemLabel label;
            if (msgs.Messages.ContainsKey(model.OldKey))
            {
                if (!msgs.Messages.TryRemove(model.OldKey, out label))
                    return false;
                label.New = false;
                label.Reviewed = false;
                label.Content = model.Content;
                msgs.Add(model.Key, label);
            }
            else
            {
                msgs.Add(model.Key, new SystemLabel()
                {
                    Content = model.Content,
                    New = true,
                    Reviewed = false
                });
            }
            return await SaveSystemMessages();
        }

        private async Task<bool> SaveSystemMessages()
        {
            var ptBR = Messages["pt-br"];
            var en = Messages["en"];
            var es = Messages["es"];
            var filter = new FilterDefinitionBuilder<SystemMessages>();
            var msgCol = IlevusDatabase.GetCollection<SystemMessages>(IlevusTableNames.SystemMessagesTable);

            var result = await msgCol.ReplaceOneAsync(filter.Where((msg) => msg.Id == ptBR.Id), ptBR);
            if (result.MatchedCount == 0)
            {
                return false;
            }
            
            result = await msgCol.ReplaceOneAsync(filter.Where((msg) => msg.Id == en.Id), en);
            if (result.MatchedCount == 0)
            {
                return false;
            }

            result = await msgCol.ReplaceOneAsync(filter.Where((msg) => msg.Id == es.Id), es);
            if (result.MatchedCount == 0)
            {
                return false;
            }
            return true;
        }

        public async Task<long> SyncMessages(IDictionary<string, SystemMessages> remote)
        {
            long processed = 0;
            SystemMessages msgs = Messages["en"];
            SystemMessages remoteMsgs = remote["en"];
            SystemLabel label;
            foreach (KeyValuePair<string, SystemLabel> msg in remoteMsgs.Messages)
            {
                processed++;
                if (msgs.Messages.ContainsKey(msg.Key))
                {
                    msgs.Messages.TryRemove(msg.Key, out label);
                }
                msgs.Add(msg.Key, msg.Value);
            }

            msgs = Messages["es"];
            remoteMsgs = remote["es"];
            foreach (KeyValuePair<string, SystemLabel> msg in remoteMsgs.Messages)
            {
                processed++;
                if (msgs.Messages.ContainsKey(msg.Key))
                {
                    msgs.Messages.TryRemove(msg.Key, out label);
                }
                msgs.Add(msg.Key, msg.Value);
            }

            msgs = Messages["pt-br"];
            remoteMsgs = remote["pt-br"];
            foreach (KeyValuePair<string, SystemLabel> msg in remoteMsgs.Messages)
            {
                processed++;
                if (msgs.Messages.ContainsKey(msg.Key))
                {
                    msgs.Messages.TryRemove(msg.Key, out label);
                }
                msgs.Add(msg.Key, msg.Value);
            }

            await SaveSystemMessages();
            return processed;
        }

        public void EnsureSystemConfig()
        {
            var configCollection = IlevusDatabase.GetCollection<SystemConfig>(IlevusTableNames.SystemConfigTable);
            var configs = configCollection.Find(FilterDefinition<SystemConfig>.Empty).FirstOrDefault();
            if (configs == null)
            {
                ResourceSet pt_br = IlevusResources.Manager.GetResourceSet(new CultureInfo(CultureHelper.GetImplementedCulture("pt-br")), true, true);
                ResourceSet en = IlevusResources.Manager.GetResourceSet(new CultureInfo(CultureHelper.GetImplementedCulture("en")), true, true);
                ResourceSet es = IlevusResources.Manager.GetResourceSet(new CultureInfo(CultureHelper.GetImplementedCulture("es")), true, true);

                configs = new SystemConfig() {
                    AccountBlockingMessages = new SystemTranslatedEmail()
                    {
                        pt_br = new SystemEmail()
                        {
                            Subject = pt_br.GetString("EmailAccountBlockSubject"),
                            Template = pt_br.GetString("EmailAccountBlockBody")
                        },
                        en = new SystemEmail()
                        {
                            Subject = en.GetString("EmailAccountBlockSubject"),
                            Template = en.GetString("EmailAccountBlockBody")
                        },
                        es = new SystemEmail()
                        {
                            Subject = es.GetString("EmailAccountBlockSubject"),
                            Template = es.GetString("EmailAccountBlockBody")
                        }
                    },
                    EmailValidationMessages = new SystemTranslatedEmail()
                    {
                        pt_br = new SystemEmail()
                        {
                            Subject = pt_br.GetString("EmailConfirmEmailSubject"),
                            Template = pt_br.GetString("EmailConfirmEmailBody")
                        },
                        en = new SystemEmail()
                        {
                            Subject = en.GetString("EmailConfirmEmailSubject"),
                            Template = en.GetString("EmailConfirmEmailBody")
                        },
                        es = new SystemEmail()
                        {
                            Subject = es.GetString("EmailConfirmEmailSubject"),
                            Template = es.GetString("EmailConfirmEmailBody")
                        }
                    },
                    RecoverPasswordMessages = new SystemTranslatedEmail()
                    {
                        pt_br = new SystemEmail()
                        {
                            Subject = pt_br.GetString("EmailRecoverPasswordSubject"),
                            Template = pt_br.GetString("EmailRecoverPasswordBody")
                        },
                        en = new SystemEmail()
                        {
                            Subject = en.GetString("EmailRecoverPasswordSubject"),
                            Template = en.GetString("EmailRecoverPasswordBody")
                        },
                        es = new SystemEmail()
                        {
                            Subject = es.GetString("EmailRecoverPasswordSubject"),
                            Template = es.GetString("EmailRecoverPasswordBody")
                        }
                    },
                    WelcomeMessages = new SystemTranslatedEmail()
                    {
                        pt_br = new SystemEmail()
                        {
                            Subject = pt_br.GetString("EmailWelcomeSubject"),
                            Template = pt_br.GetString("EmailWelcomeBody")
                        },
                        en = new SystemEmail()
                        {
                            Subject = en.GetString("EmailWelcomeSubject"),
                            Template = en.GetString("EmailWelcomeBody")
                        },
                        es = new SystemEmail()
                        {
                            Subject = es.GetString("EmailWelcomeSubject"),
                            Template = es.GetString("EmailWelcomeBody")
                        }
                    }
                };

                configCollection.InsertOne(configs);
            }
            SystemConfiguration = configs;

            var msgCollection = IlevusDatabase.GetCollection<SystemMessages>(IlevusTableNames.SystemMessagesTable);
            Messages = new ConcurrentDictionary<string, SystemMessages>();
            var msgs = msgCollection.Find(FilterDefinition<SystemMessages>.Empty).ToList();
            foreach (var msg in msgs)
            {
                Messages.Add(msg.Language, msg);
            }

            var lang = CultureHelper.GetImplementedCulture("pt-br");
            SystemMessages messages;
            try
            {
                messages = Messages[lang];
            }
            catch (KeyNotFoundException ex)
            {
                messages = CreateMSystemMessages(lang, msgCollection);
                Messages.Add(lang, messages);
            }

            lang = CultureHelper.GetImplementedCulture("en");
            try
            {
                messages = Messages[lang];
            }
            catch (KeyNotFoundException ex)
            {
                messages = CreateMSystemMessages(lang, msgCollection);
                Messages.Add(lang, messages);
            }

            lang = CultureHelper.GetImplementedCulture("es");
            try
            {
                messages = Messages[lang];
            }
            catch (KeyNotFoundException ex)
            {
                messages = CreateMSystemMessages(lang, msgCollection);
                Messages.Add(lang, messages);
            }
        }

        private SystemMessages CreateMSystemMessages(string lang, IMongoCollection<SystemMessages> msgCollection)
        {
            var msgs = new SystemMessages()
            {
                Language = lang
            };
            var culture = new CultureInfo(lang);
            ResourceSet resourceSet = IlevusResources.Manager.GetResourceSet(culture, true, true);
            IDictionaryEnumerator enumerator = resourceSet.GetEnumerator();
            while (enumerator.MoveNext())
            {
                var msg = new SystemLabel()
                {
                    Content = enumerator.Value.ToString(),
                    Reviewed = true,
                    New = false
                };
                msgs.Add(enumerator.Key.ToString(), msg);
            }
            msgCollection.InsertOne(msgs);
            return msgs;
        }

        public void Migrations()
        {

            var collection = GetUsersCollection();
            var services = collection.Find(f => f.Professional.Services.Any(s => s.Id.Equals(Guid.Empty)));

            var filter = Builders<IlevusUser>.Filter.Where(x => x.Professional.Services.Any(y => y.Id == Guid.Empty));
            var update = Builders<IlevusUser>.Update.Set(x => x.Professional.Services.ElementAt(-1).Id, Guid.NewGuid());
            var result = collection.UpdateManyAsync(filter, update).Result;


			FieldDefinition<IlevusUser> field = "Financial";
			var filter2 = Builders<IlevusUser>.Filter.Exists(field);
			var update2 = Builders<IlevusUser>.Update.Unset(field);
			var result2 = collection.UpdateManyAsync(filter2, update2).Result;

		}

		public void EnsureIndexes()
        {
            var ads = GetAdsCollection();
            var conversations = GetConversationsCollection();
            var coachingProcesses = GetCoachingProcessCollection();
            var meetings = GetMeetingScheduleCollection();
            var pictures = GetPicturesCollection();
            var subscriptions = GetSubscriptionsCollection();
            var users = IlevusDatabase.GetCollection<IlevusUser>("users");

            // Ad searching opts
            var adSearch = Builders<Ad>.IndexKeys.Combine(
                Builders<Ad>.IndexKeys.Text(ad => ad.Headline),
                Builders<Ad>.IndexKeys.Text(ad => ad.Keywords)
            );
            var adWeights = new BsonDocument();
            adWeights["Headline"] = 2;
            adWeights["Keywords"] = 3;
            var adOpts = new CreateIndexOptions<Ad>()
            {
                DefaultLanguage = "portuguese",
                LanguageOverride = "AdLanguage",
                Name = "AdSearchIndex",
                Weights = adWeights
            };
            ads.Indexes.CreateOne(adSearch, adOpts);

            var checksum = Builders<IlevusPicture>.IndexKeys.Ascending(pic => pic.Checksum);
            var unique = new CreateIndexOptions { Unique = true,  };

            pictures.Indexes.CreateOne(checksum, unique);

            var authors = Builders<ChatConversation>.IndexKeys.Combine(
                Builders<ChatConversation>.IndexKeys.Ascending(conversation => conversation.FirstUser),
                Builders<ChatConversation>.IndexKeys.Ascending(conversation => conversation.SecondUser)
            );
            var daySort = Builders<ChatConversation>.IndexKeys.Descending(conversation => conversation.Day);

            conversations.Indexes.CreateOne(authors);
            conversations.Indexes.CreateOne(daySort);

            var tableFilter = Builders<MeetingSchedule>.IndexKeys.Combine(
                Builders<MeetingSchedule>.IndexKeys.Ascending(meeting => meeting.UserId),
                Builders<MeetingSchedule>.IndexKeys.Ascending(meeting => meeting.Begin)
            );
            var begin = Builders<MeetingSchedule>.IndexKeys.Ascending(meeting => meeting.Begin);
            var userId = Builders<MeetingSchedule>.IndexKeys.Ascending(meeting => meeting.UserId);

            meetings.Indexes.CreateOne(tableFilter);
            meetings.Indexes.CreateOne(begin);
            meetings.Indexes.CreateOne(userId);


            var subUserId = Builders<IlevusSubscription>.IndexKeys.Ascending(sub => sub.UserId);
            var subStatus = Builders<IlevusSubscription>.IndexKeys.Combine(
                Builders<IlevusSubscription>.IndexKeys.Ascending(sub => sub.UserId),
                Builders<IlevusSubscription>.IndexKeys.Ascending(sub => sub.Status)
            );
            //subscriptions.Indexes.CreateOne(subUserId);
            //subscriptions.Indexes.CreateOne(subStatus);

            //// User search indexes
            //var text = Builders<IlevusUser>.IndexKeys.Combine(
            //    Builders<IlevusUser>.IndexKeys.Ascending(u => u.IsProfessional),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Email),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Name),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Surname),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.City),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.County),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Country),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Industry),
            //    Builders<IlevusUser>.IndexKeys.Text("Professional.Services.Name"),
            //    Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Specialties)
            //);
            //var weights = new BsonDocument();
            //weights["Email"] = 10;
            //weights["Surname"] = 8;
            //weights["Name"] = 6;
            //weights["Professional.Industry"] = 6;
            //weights["Professional.Services.Name"] = 6;
            //weights["Professional.Specialties"] = 6;
            //weights["Professional.City"] = 4;
            //weights["Professional.County"] = 2;
            //weights["Professional.Country"] = 1;
            //var textOpts = new CreateIndexOptions<IlevusUser>()
            //{
            //    DefaultLanguage = "portuguese",
            //    LanguageOverride = "SearchLanguage",
            //    Name = "UserSearchIndex",
            //    Weights = weights
            //};

            //users.Indexes.CreateOne(text, textOpts);
        }

        public void Dispose()
        {
            
        }
    }
}