// https://github.com/diegohaz/arc/wiki/Atomic-Design
import React from 'react'

import { PageTemplate, PaymentStatement } from 'components'

const data = [{
  Data: '13/01/2017',
  Usuario: 'Marcos Moacir',
  Servico: 'Curso de gestão da informação.',
  FormaDePagamento: 'xx.xx.xx.xx.xx.42',
  Status: 'Aguardando Aprovação',
  ValorTotal: 'R$ 2500,00',
  ValorTaxas: 'R$  500,00',
  ValorLíquido: 'R$ 2000,00',
}]

const HomePage = () => {
  return (
    <PageTemplate>
      <PaymentStatement  list={ data } />
    </PageTemplate>
  )
}

export default HomePage
