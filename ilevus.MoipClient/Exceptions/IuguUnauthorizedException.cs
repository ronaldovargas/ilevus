using System;

namespace ilevus.MoipClient.Exceptions
{
    public class MoipUnauthorizedException : Exception
    {
        public MoipUnauthorizedException() : base("Voc� n�o est� autenticado ou seu Token � invalido") { }
    }
}