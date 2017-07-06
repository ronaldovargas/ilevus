using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ilevus.MoipClient.Models
{
    public class Email
    {

        public Email(string email)
        {
            this.Address = email;
        }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("confirmed")]
        public string Confirmed { get; set; }
    }
}
