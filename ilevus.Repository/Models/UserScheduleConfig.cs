using MongoRepository;

namespace ilevus.Models
{
	public class UserScheduleConfig
	{
		public bool Enabled { get; set; }
		public int Interval { get; set; }
		public int Antecedence { get; set; }
		public string HourConfig { get; set; }

		public UserScheduleConfig()
		{
			this.Enabled = false;
			this.Interval = 30;
			this.Antecedence = 12;
			this.HourConfig = "[]";
		}
	}
}