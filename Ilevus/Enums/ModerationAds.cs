using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Enums
{
    public class ModerationAds
    {
        //Aguardando análise, Em Análise, Aprovado, Reprovado
        public const string WaitingAnalysis = "WaitingAnalysis";
        public const string OnAnalysing = "OnAnalysing";
        public const string Approved = "Approved";
        public const string Denied = "Denied";
    }
}