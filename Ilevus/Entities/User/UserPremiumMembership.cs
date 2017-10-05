using System;

namespace ilevus.Models
{
	public class UserPremiumMembership
	{
		public bool Active { get; set; }
		public bool Late { get; set; }
		public bool Suspended { get; set; }
		public DateTime PayedUntil { get; set; }
	}
}