using AspNet.Identity.MongoDB;
using ilevus.App_Start;

namespace ilevus.Models
{
	public class IlevusRoleStore : RoleStore<IlevusRole>
	{
		public IlevusRoleStore(IlevusIdentityContext context)
			: base(new RolesContext<IlevusRole>(context.Roles))
		{
		}
	}
}