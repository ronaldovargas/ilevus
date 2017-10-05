using AspNet.Identity.MongoDB;
using ilevus.App_Start;

namespace ilevus.Models
{
	public class IlevusUserStore : UserStore<IlevusUser>
	{
		public IlevusUserStore(IlevusIdentityContext context)
			: base(new UsersContext<IlevusUser>(context.Users))
		{
		}
	}
}