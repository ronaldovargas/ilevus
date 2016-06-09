using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class IlevusCity
    {
        public string Country { get; set; }
        public string County { get; set; }

        public List<string> Cities { get; set; }
    }
}