// https://github.com/diegohaz/arc/wiki/Atomic-Design
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DataTable, PageTemplate } from 'components'
import 'react-table/react-table.css'

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


const PaymentStatement = ({
  list, loading, failed, ...props
}) => {
  return (
    <PageTemplate>
      <DataTable
        {...props}
        columns={columns}
        data={list}
        loading={loading}
        failed={failed}
      />
    </PageTemplate>
  )
}

PaymentStatement.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
}


export default PaymentStatement
