﻿using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
	public class Self
	{

		[JsonProperty("href")]
		public string Href { get; set; }

		[JsonProperty("title")]
		public object Title { get; set; }
	}
}
