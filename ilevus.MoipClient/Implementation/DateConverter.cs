using System;
using ilevus.MoipClient.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace ilevus.MoipClient.Implementation
{
	public class DateConverter : IsoDateTimeConverter
	{
		public DateConverter()
		{
			base.DateTimeFormat = "yyyy-MM-dd";
		}
	}
}