using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models.CoachingTools
{

    public class WheelOfLifeField
    {
        public string Label { get; set; }
        public string Instructions { get; set; }
        public double Evaluation { get; set; }
    }

    public class WheelOfLifeTask
    {
        public string Field { get; set; }
        public string Label { get; set; }

        [BsonDateTimeOptions(DateOnly = true)]
        public DateTime Deadline { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public bool Finished { get; set; }

        public WheelOfLifeTask()
        {
            Field = "N/A";
            Label = "Task";
            CreatedAt = DateTime.Now;
            Finished = false;
        }
    }

    public class WheelOfLife
    {
        public string Learnings { get; set; }
        public int Status { get; set; }
        public List<WheelOfLifeField> Fields { get; set; }
        public List<WheelOfLifeTask> Tasks { get; set; }

        public WheelOfLife()
        {
            Status = 0;
            Fields = new List<WheelOfLifeField>();
            Tasks = new List<WheelOfLifeTask>();
        }

        public WheelOfLife(List<WheelOfLifeField> fields) : this()
        {
            Fields = fields;
        }

        #region Helpers

        public static List<WheelOfLifeField> GetDefaults()
        {
            var WheelOfLifeDefaults = new List<WheelOfLifeField>();
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Saúde",
                Instructions = @"
Perceba que falar em saúde é muito mais do que simplesmente ausência de
doença, estamos falando do ser como um todo.

- Na sua opinião o que significa ter saúde?
- De acordo com o que você entende, quanto dedica tempo para cuidar de si mesmo e da sua saúde?
- Você cuida da sua saúde com orientação médica e exames de check up?
- Você acredita ter consciência do seu corpo e o valor dele para sua vida?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Trabalho",
                Instructions = @"
Mede o nível de satisfação com o trabalho e se este proporciona satisfação.

- Para você qual é a importância do trabalho na sua vida?
- Você trabalha na área que gosta?
- Possui o hábito de participar de workshop, seminários, congressos como forma de melhorar seus conhecimentos e Network?
- O quanto de fato você acredita ser feliz com seu trabalho?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Dinheiro (Renda)",
                Instructions = @"
Avalia se você está satisfeito com sua renda e se esta permite
investir em você e no seu crescimento.

- Você se considera uma pessoa equilibrada financeiramente?
- Na sua opinião você ganha o suficiente para sobreviver?
- Você acredita ter alguma crença que limita sua capacidade de ganhar dinheiro?
- Você acredita que irá alcançar a sua independência financeira?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Profissão",
                Instructions = @"
Avalia se existe uma preocupação com a Carreira e seu planejamento.
Diferente do trabalho, aqui o foco é realização profissional.

- Hoje você trabalha na mesma área da sua profissão?
- Você possui um plano de carreira? Caso não pretende, ter um plano de carreira?
- Atualmente investe parte da sua renda e do seu tempo na sua profissão?
- Hoje consegue perceber oportunidades de crescer na sua profissão?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Família",
                Instructions = @"
Avalia sua percepção quanto ao seu papel na família e a influência dela na
sua vida, determinando sua construção de valores e crenças.

- Você possui uma boa relação familiar? Em relação aos pais, tios, primos, etc, tem convivência?
- Os seus valores atuais estão relacionados com os seus pais e sua criação?
- Sua família tem sido fonte de incentivo e apoio na sua vida e nos seus projetos?
- Suas decisões são baseadas em como sua família pensa ou desejaria que você agisse?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Prosperidade",
                Instructions = @"
Neste momento estamos avaliando não apenas a capacidade de gerar
riqueza, mas sim quanto nossos projetos e ações geram benefícios para a sociedade
e para os que amamos.

- Você se considera uma pessoa próspera? O que justifica seu pensamento?
- Você se considera uma pessoa de sucesso? Poderia relacionar os sucessos obtidos neste ano?
- Quando pensa na sua prosperidade pensa o quanto esta irá modificar a vida de outras pessoas?
- Você tem planos relacionados a gerar mais prosperidade para o futuro próximo?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Projetos",
                Instructions = @"
Mede o nível de projeção e realização de novos projetos e em quais áreas
da vida mais se investe.

- Você costuma idealizar novos projetos e como estes modificam sua vida?
- Hoje você está se dedicando a algum projeto?
- Quando pensa em projetos o mesmo se relaciona a que área?
- Você costuma finalizar seus projetos ou a maioria fica inacabada?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Hobbies e Contribuição",
                Instructions = @"
Quanto você dedica tempo para si mesmo e para contribuir
com outras pessoas.

- Você tem uma rotina ou atividade na qual dedica totalmente a você e seu bem estar?
- Hoje você avalia ser uma pessoa com boa autoestima?
- Quanto você dedica do seu tempo para ajudar outras pessoas?
- Quando pensa no seu sucesso imagina como este irá impactar a sua vida e de outras pessoas?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Amigos",
                Instructions = @"
Pensar na importância e na construção de boas relações interpessoais,
sejam nas esferas pessoas ou profissionais.

- Você possui um bom ciclo de amizade e dedica tempo para seus amigos?
- Hoje, você é tem facilidade de relacionamento e fazer amizades?
- No ambiente profissional você desenvolve boas relações gerando vínculos de amizades?
- Hoje você se relaciona mais e melhor através de redes sociais? Prefere manter uma certa privacidade?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Liderança Pessoal",
                Instructions = @"
Vamos pensar no seu autocontrole e desenvolvimento de uma
liderança focada em você.

- Você entende o conceito de liderança pessoal e como ela interfere na sua vida?
- Você se considera mais um líder ou um liderado?
- Olhando para sua vida, você busca superar seus limites e ser melhor?
- Atualmente você tem exercido a liderança pessoal?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Propósito",
                Instructions = @"
Avalia e mede quanto direcionamos nossa vida e nossa atitude para objetivos.

- Você vive de acordo com um propósito, unindo todas as áreas da sua vida em uma direção única?
- No seu entendimento propósito é importante na sua vida?
- Hoje você tem alcançado resultados em função de um propósito?
- Você é capaz de perceber em que área da vida possue um propósito mais forte?

"
            });
            WheelOfLifeDefaults.Add(new WheelOfLifeField()
            {
                Label = "Espiritualidade",
                Instructions = @"
Constitui a percepção de importância e razão de vida. Une todas as
áreas dos quadrantes.

- Você percebe a razão para sua vida?
- Você tem consciência da sua importância para a vida das pessoas e para o mundo?
- Você possui alguma crença espiritual e vive conforme esta crença?
- A religião tem importância na sua vida e nas suas relações?

"
            });

            return WheelOfLifeDefaults;
        }

        #endregion
    }
}