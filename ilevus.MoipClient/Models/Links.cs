using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
	public class Links
	{

		[JsonProperty("self")]
		public Self Self { get; set; }

		[JsonProperty("setPassword")]
		public SetPassword SetPassword { get; set; }
	}
}
