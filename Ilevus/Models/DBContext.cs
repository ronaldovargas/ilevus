using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using ElCamino.AspNet.Identity.Dynamo;
using ElCamino.AspNet.Identity.Dynamo.Configuration;
using ElCamino.AspNet.Identity.Dynamo.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.Models
{
    public class IlevusTableNames
    {
        public const string PicturesTable = "ilevus_pictures";
    }

    public class IlevusDBContext : DynamoDBContext
    {
        private AmazonDynamoDBClient _client;
        protected bool _disposed = false;
        private IdentityConfiguration _config = null;
        
        public AmazonDynamoDBClient Client
        {
            get { return _client; }
        }
        
        public IlevusDBContext() : this(IdentityConfigurationSection.GetCurrent() ??
              new IdentityConfiguration()
              {
                  ServiceURL = System.Configuration.ConfigurationManager.ConnectionStrings[Constants.AppSettingsKeys.DefaultStorageConnectionStringKey].ConnectionString,
                  TablePrefix = string.Empty
              }) {}
        
        public IlevusDBContext(IdentityConfiguration config)
            : base(new AmazonDynamoDBClient(config))
        {
            _config = config;
            _client = new AmazonDynamoDBClient(config);
        }

        public async Task CreateTablesIfNotExistsAsync()
        {
            await new TaskFactory().StartNew(() =>
            {
                var tableRespone = _client.ListTables();

                bool pictureTableExists = tableRespone.TableNames.Any(t => t == IlevusTableNames.PicturesTable);
                if (!pictureTableExists)
                {
                    var request = GenerateCreateTableRequest(
                        IlevusTableNames.PicturesTable, "UserId", "Checksum"
                    );
                    var response = _client.CreateTable(request);

                    WaitTillTableCreated(request.TableName, response);
                }
            });
        }

        protected CreateTableRequest GenerateCreateTableRequest(string tableName, string hashKey, string rangeKey)
        {
            return new CreateTableRequest
            {
                TableName = tableName,
                AttributeDefinitions = new List<AttributeDefinition>()
                {
                    new AttributeDefinition
                    {
                        AttributeName = hashKey,
                        AttributeType = "S"
                    },
                    new AttributeDefinition
                    {
                        AttributeName = rangeKey,
                        AttributeType = "S"
                    }
                },
                KeySchema = new List<KeySchemaElement>()
                {
                    new KeySchemaElement
                    {
                        AttributeName = hashKey,
                        KeyType = KeyType.HASH
                    },
                    new KeySchemaElement
                    {
                        AttributeName = rangeKey,
                        KeyType = KeyType.RANGE
                    },
                },
                ProvisionedThroughput = new ProvisionedThroughput
                {
                    ReadCapacityUnits = 1,
                    WriteCapacityUnits = 1
                }/*,
                GlobalSecondaryIndexes = new List<GlobalSecondaryIndex>
                    {
                        new GlobalSecondaryIndex
                        {
                            IndexName = userEmailIndex,
                            KeySchema = new List<KeySchemaElement>()
                            {
                                new KeySchemaElement
                                {
                                    AttributeName = "Email",
                                    KeyType = KeyType.HASH
                                },
                                new KeySchemaElement
                                {
                                    AttributeName = "Id",
                                    KeyType = KeyType.RANGE
                                },

                            },
                            Projection = new Projection
                            {
                                 ProjectionType = new ProjectionType("ALL")
                            },
                            ProvisionedThroughput = new ProvisionedThroughput
                            {
                                ReadCapacityUnits = 1,
                                WriteCapacityUnits = 1
                            },
                        },
                        new GlobalSecondaryIndex
                        {
                            IndexName = userNameIndex,
                            KeySchema = new List<KeySchemaElement>()
                            {
                                new KeySchemaElement
                                {
                                    AttributeName = "UserName",
                                    KeyType = KeyType.HASH
                                },
                                new KeySchemaElement
                                {
                                    AttributeName = "Id",
                                    KeyType = KeyType.RANGE
                                },
                            },
                            Projection = new Projection
                            {
                                 ProjectionType = new ProjectionType("ALL")
                            },
                            ProvisionedThroughput = new ProvisionedThroughput
                            {
                                ReadCapacityUnits = 1,
                                WriteCapacityUnits = 1
                            },
                        }
                    },*/
            };
        }

        protected void WaitTillTableCreated(string tableName, CreateTableResponse response)
        {
            var tableDescription = response.TableDescription;
            string status = tableDescription.TableStatus;
            // Let us wait until table is created. Call DescribeTable.
            while (status != "ACTIVE")
            {
                System.Threading.Thread.Sleep(3000); // Wait 3 seconds.
                try
                {
                    var res = _client.DescribeTable(new DescribeTableRequest
                    {
                        TableName = tableName
                    });
                    status = res.Table.TableStatus;
                }
                // Try-catch to handle potential eventual-consistency issue.
                catch (ResourceNotFoundException) { throw; }
            }
        }
    }
}