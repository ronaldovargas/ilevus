using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class Links
    {

        [JsonProperty("self")]
        public Self self { get; set; }
    }

}
