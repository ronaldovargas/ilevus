using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class Holder
    {
        [JsonProperty("taxDocument")]
        public TaxDocument taxDocument { get; set; }

        [JsonProperty("fullname")]
        public string fullname { get; set; }
    }

}
