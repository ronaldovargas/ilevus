using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.Helpers
{
    public class LinkedinUser
    {
        public string id { get; set; }
        public string emailAddress { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string headline { get; set; }
        public string pictureUrl { get; set; }
        public string summary { get; set; }
        public string specialties { get; set; }
        public string industry { get; set; }
        public string publicProfileUrl { get; set; }
    }

    public class LinkedinClient
    {
        private string _accessToken;
        private string _appId;
        /// <summary>
        /// Gets or sets the access token.
        /// </summary>
        public virtual string AccessToken
        {
            get { return _accessToken; }
            set { _accessToken = value; }
        }

        /// <summary>
        /// Gets or sets the app id.
        /// </summary>
        public virtual string AppId
        {
            get { return _appId; }
            set { _appId = value; }
        }
        
        public LinkedinClient(string accessToken)
        {
            _accessToken = accessToken;
        }

        public static async Task<LinkedinClient> Create(string code, string clientId, string clientSecret, string redirectUri)
        {
            var client = new HttpClient();
            var postData = new Dictionary<string, string>
            {
               { "grant_type", "authorization_code" },
               { "code", code },
               { "redirect_uri", redirectUri },
               { "client_id", clientId },
               { "client_secret", clientSecret }
            };
            var content = new FormUrlEncodedContent(postData);

            var response = await client.PostAsync("https://www.linkedin.com/oauth/v2/accessToken", content);

            var responseString = await response.Content.ReadAsStringAsync();
            JObject data = JsonConvert.DeserializeObject<JObject>(responseString);
            if (data.GetValue("access_token") != null)
            {
                return new LinkedinClient(data.GetValue("access_token").ToString());
            }
            return null;
        }

        public Task<JObject> Get(string endpoint)
        {
            return Get<JObject>(endpoint);
        }
        public async Task<T> Get<T>(string endpoint)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + AccessToken);
            client.DefaultRequestHeaders.Add("x-li-format", "json");

            string content = await client.GetStringAsync(endpoint);
            var data = JsonConvert.DeserializeObject<T>(content);
            return data;
        }

        public async Task<JObject> Post(string endpoint)
        {
            JObject data = new JObject();
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + AccessToken);
            client.DefaultRequestHeaders.Add("x-li-format", "json");

            string content = await(await client.PostAsync(endpoint, null)).Content.ReadAsStringAsync();
            data = JsonConvert.DeserializeObject<JObject>(content);

            return data;
        }
        
    }
    
}