using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Ilevus.Startup))]
namespace Ilevus
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
