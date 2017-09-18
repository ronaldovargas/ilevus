using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models.CoachingTools
{
    public class CoachingToolsConfigurations
    {
        public List<WheelOfLifeField> WheelOfLifeDefaults { get; set; }

        public CoachingToolsConfigurations()
        {
            WheelOfLifeDefaults = WheelOfLife.GetDefaults();
        }
    }

}