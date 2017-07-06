using System;
using System.Collections.Generic;
using System.Linq;
using ilevus.MoipClient.Models;

namespace ilevus.MoipClient.Exceptions
{
    public class MoipErrorException : Exception
    {
        private IList<Error> erros;


        public MoipErrorException(IList<Error> erros)
            : base($"{MontaMensagemDaListaDeErros(erros)}")
        {
            this.erros = erros;
        }

        private static string MontaMensagemDaListaDeErros(IList<Error> erros)
            => String.Join(Environment.NewLine, erros.Select(x => x.description));
    }
}