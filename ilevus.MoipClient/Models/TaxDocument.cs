using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class TaxDocument
    {

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("number")]
        public string Number { get; set; }
    }
}
