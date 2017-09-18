using Newtonsoft.Json;
using System;
using ilevus.MoipClient.Implementation;

namespace ilevus.MoipClient.Models
{
    public class ContaMoip
    {

		public ContaMoip()
		{
			Person = new Person();
		}

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("email")]
        public Email Email { get; set; }

        [JsonProperty("person")]
        public Person Person { get; set; }

        [JsonProperty("login")]
        public string Login { get; set; }


        [JsonProperty("accessToken")]
        public string AccessToken { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? createdAt { get; set; }

        [JsonProperty("businessSegment")]
        public BusinessSegment businessSegment { get; set; }

        [JsonProperty("type")]
        public string Type { get; } = "MERCHANT";
    }
}
