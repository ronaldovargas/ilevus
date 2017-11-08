// https://github.com/diegohaz/arc/wiki/Storybook
import React from 'react'
import { storiesOf } from '@storybook/react'
import { PaymentStatement } from 'components'

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
storiesOf('PaymentStatement', module)
  .add('default', () => (
    <PaymentStatement data={data} />
  ))
