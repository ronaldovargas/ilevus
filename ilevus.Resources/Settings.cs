using System;
using System.Collections.Generic;
using System.Linq;
using System.Resources;
using System.Text;
using System.Threading.Tasks;

namespace ilevus.Resources
{
    public class IlevusResources
    {
        public static ResourceManager Manager
        {
            get
            {
                return Messages.ResourceManager;
            }
        }
    }
}
