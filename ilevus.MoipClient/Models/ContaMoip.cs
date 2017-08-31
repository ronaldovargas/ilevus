using Newtonsoft.Json;
using System;
using ilevus.MoipClient.Implementation;
using Newtonsoft.Json.Linq;

namespace ilevus.MoipClient.Models
{
	public class ContaMoip
	{
		private object email;

		public ContaMoip()
		{
			Person = new Person();
		}

		[JsonProperty("id")]
		public string Id { get; set; }

		[JsonProperty("email")]
		[JsonConverter(typeof(EmailConverter))]
		public Email Email
		{
			get
			{
				return (Email)email;
			}
			set
			{
				if (value is string)
				{
					email =  new Email(value.ToString());
				}
				else
				{
					email = value;
				}
			}
		}
			

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

		[JsonProperty("_links")]
		public Links Links { get; set; }

		//"_links": {
		//      "self": {
		//          "href": "https://sandbox.moip.com.br/moipaccounts/MPA-BCE4BF44D333",
		//          "title": null
		//      },
		//      "setPassword": {
		//          "href": "https://desenvolvedor.moip.com.br/sandbox/AskForNewPassword.do?method=confirm\u0026email=eugenio100%40gmail.com\u0026code=0a718bf4d0abdfa9abe309a97d7c984b"
		//      }
		//}
	}
}
