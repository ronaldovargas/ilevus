using System;
using Newtonsoft.Json;
using ilevus.MoipClient.Models;
using Newtonsoft.Json.Linq;

class EmailConverter : JsonConverter
{
	public override bool CanConvert(Type objectType)
	{
		return objectType.IsClass ;
	}

	public override bool CanWrite
	{
		get { return false; }
	}

	public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
	{
		if (reader.TokenType == JsonToken.String)
		{
			var email = new Email((string)reader.Value);
			return email;
		}

		if (reader.TokenType == JsonToken.StartObject)
		{
			var email = reader.Value;
			return email;
		}
		return null;
	}

	public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
	{
		throw new NotImplementedException();
	}
}