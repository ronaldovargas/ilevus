using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class Address
    {

        [JsonProperty("street")]
        public string Street { get; set; }

        [JsonProperty("streetNumber")]
        public string StreetNumber { get; set; }

        [JsonProperty("district")]
        public string District { get; set; }

        [JsonProperty("zipCode")]
        public string ZipCode { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }
    }
}
