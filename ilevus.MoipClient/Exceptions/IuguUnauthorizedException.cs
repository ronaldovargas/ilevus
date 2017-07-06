using System;

namespace ilevus.MoipClient.Exceptions
{
    public class MoipUnauthorizedException : Exception
    {
        public MoipUnauthorizedException() : base("Você não está autenticado ou seu Token é invalido") { }
    }
}