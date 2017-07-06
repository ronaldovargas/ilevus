using System.Threading.Tasks;
using ilevus.MoipClient.Models;

namespace ilevus.MoipClient.Implementation
{
    public partial class MoipApiClient
    {

        public async Task<ContaMoip> CriarContaMoip(ContaMoip conta) => await Post(conta, "/accounts");

        public async Task<ContaMoip> ConsultarContaMoip(string contaId) => await Get<ContaMoip>(contaId, "/accounts/{id}");
        public async Task<ContaBancaria> CriarContaBancaria(ContaBancaria contaBancaria) => await Post<ContaBancaria>(contaBancaria, $"/accounts/{contaBancaria.AccountId}/bankaccounts");

    }
}
