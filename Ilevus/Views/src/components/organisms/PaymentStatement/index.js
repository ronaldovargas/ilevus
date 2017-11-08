// https://github.com/diegohaz/arc/wiki/Atomic-Design
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DataTable, PageTemplate } from 'components'

const columns = [{
  Header: 'Data',
  accessor: 'Data', // String-based value accessors!
}, {
  Header: 'Usuário',
  accessor: 'Usuario',
}, {
  Header: 'Serviço',
  accessor: 'Servico',
}, {
  Header: 'Forma de pagamento',
  accessor: 'FormaDePagamento',
},
{
  Header: 'Status',
  accessor: 'Status',
},
{
  Header: 'R$ Total',
  accessor: 'ValorTotal',
},
{
  Header: 'R$ Taxas',
  accessor: 'ValorTaxas',
},
{
  Header: 'R$ Líquido',
  accessor: 'ValorLíquido',
},
]


const PaymentStatement = ({ data, ...props }) => {
  return (
    <PageTemplate>
      <DataTable
        {...props}
        columns={columns}
        data={data}
      />
    </PageTemplate>
  )
}

PaymentStatement.propTypes = {
  data: PropTypes.array.isRequired,
}


export default PaymentStatement
