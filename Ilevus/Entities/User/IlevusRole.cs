using AspNet.Identity.MongoDB;

namespace ilevus.Models
{
	public class IlevusRole : IdentityRole
	{
		public string Description { get; set; }

		public IlevusRole()
		{
		}

		public IlevusRole(string name)
			: this()
		{
			this.Name = name;
		}

	}
}