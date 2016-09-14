using ilevus.Helpers;
using ilevus.Resources;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Resources;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.Models
{
    public class IlevusTableNames
    {
        public const string CitiesTable = "ilevus_cities";
        public const string PicturesTable = "ilevus_pictures";
        public const string SystemConfigTable = "ilevus_system";
    }


    public class IlevusDBContext : MongoClient, IDisposable
    {
        public IMongoDatabase IlevusDatabase { get; private set; }
        public static SystemConfig SystemConfiguration { get; private set; }

        public static IlevusDBContext Create()
        {
            return new IlevusDBContext("mongodb://localhost:27017");
        }

        private IlevusDBContext(string url) : base(url)
        {
            IlevusDatabase = GetDatabase("ilevus");
        }
        
        public IMongoCollection<IlevusPicture> GetPicturesCollection()
        {
            return IlevusDatabase.GetCollection<IlevusPicture>(IlevusTableNames.PicturesTable);
        }

        public Task UpdateSystemConfig()
        {
            var configCollection = IlevusDatabase.GetCollection<SystemConfig>(IlevusTableNames.SystemConfigTable);
            return configCollection.ReplaceOneAsync(Builders<SystemConfig>.Filter.Eq("_id", SystemConfiguration.Id), SystemConfiguration);
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
        }

        public void EnsureIndexes()
        {
            // Criando índice para busca em texto no usuário.
            var pictures = GetPicturesCollection();
            var users = IlevusDatabase.GetCollection<IlevusUser>("users");

            var checksum = Builders<IlevusPicture>.IndexKeys.Ascending(pic => pic.Checksum);
            var unique = new CreateIndexOptions { Unique = true };

            pictures.Indexes.CreateOne(checksum, unique);

            var text = Builders<IlevusUser>.IndexKeys.Combine(
                Builders<IlevusUser>.IndexKeys.Text(u => u.Email),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Name),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Surname),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.City),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.County),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Country),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Industry),
                Builders<IlevusUser>.IndexKeys.Text(u => u.Professional.Specialties)
            );
            var weights = new BsonDocument();
            weights["Email"] = 10;
            weights["Surname"] = 8;
            weights["Name"] = 6;
            weights["Professional.Industry"] = 6;
            weights["Professional.Specialties"] = 6;
            weights["Professional.City"] = 4;
            weights["Professional.County"] = 2;
            weights["Professional.Country"] = 1;
            var textOpts = new CreateIndexOptions<IlevusUser>()
            {
                DefaultLanguage = "portuguese",
                LanguageOverride = "SearchLanguage",
                Name = "UserSearchIndex",
                Weights = weights
            };

            users.Indexes.CreateOne(text, textOpts);
        }

        public void Dispose()
        {
            
        }
    }
}