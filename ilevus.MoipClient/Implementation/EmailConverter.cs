using System;
using ilevus.MoipClient.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ilevus.MoipClient.Implementation
{
	public class EmailConverter : JsonConverter
	{
		public override bool CanConvert(Type objectType)
		{
			return (objectType == typeof(Email) || objectType == typeof(string));
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			if (reader.ValueType == typeof(string))
				return new Email(reader.Value.ToString());

			var obj = JObject.Load(reader);
			return obj.ToObject<Email>();

		}

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			serializer.Serialize(writer, value);
		}
	}
}