using System;
using Amazon.Auth;
using Amazon.DynamoDBv2;
using Amazon.Runtime;

namespace ilevus
{
    public class DynamoConfig
    {
        public static AmazonDynamoDBConfig DynamoDBConfig { get; private set; }
        public static AmazonDynamoDBClient DynamoDBClient { get; private set; }

        public static void Configure()
        {
            DynamoDBConfig = new AmazonDynamoDBConfig();
            DynamoDBConfig.ServiceURL = "http://localhost:8000";
            DynamoDBClient = new AmazonDynamoDBClient(new AWSCredentialsImpl(), DynamoDBConfig);
        }
        private class AWSCredentialsImpl : AWSCredentials
        {
            public override ImmutableCredentials GetCredentials()
            {
                return new ImmutableCredentials("accessKey", "secretKey", "token");
            }
        }
    }
    
}