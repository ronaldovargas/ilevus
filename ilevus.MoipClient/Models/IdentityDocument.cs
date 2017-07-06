using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class IdentityDocument
    {

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("number")]
        public string Number { get; set; }

        [JsonProperty("issuer")]
        public string Issuer { get; set; }

        [JsonProperty("issueDate")]
        public string IssueDate { get; set; }
    }
}
