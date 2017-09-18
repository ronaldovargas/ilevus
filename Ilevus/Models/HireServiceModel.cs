using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
	public class HireServiceModel
	{
		public IlevusUser user { get; set; }
		public Stripe.StripeToken stripe { get; set; }
		public UserService service { get; set; }
	}
}