using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class Phone
    {

        [JsonProperty("countryCode")]
        public string CountryCode { get; } = "55";

        [JsonProperty("areaCode")]
        public string AreaCode { get; set; }

        [JsonProperty("number")]
        public string Number { get; set; }
    }
}
