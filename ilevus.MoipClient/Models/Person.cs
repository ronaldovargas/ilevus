using System;
using ilevus.MoipClient.Implementation;
using Newtonsoft.Json;

namespace ilevus.MoipClient.Models
{
    public class Person
    {

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("taxDocument")]
        public TaxDocument TaxDocument { get; set; }

        [JsonProperty("identityDocument")]
        public IdentityDocument IdentityDocument { get; set; }

        [JsonProperty("birthDate")]
		public string BirthDate { get; set; }

        [JsonProperty("phone")]
        public Phone Phone { get; set; }

        [JsonProperty("address")]
        public Address Address { get; set; }
    }
}
