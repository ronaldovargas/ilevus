import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isPending, hasFailed } from 'redux-saga-thunk'
import { fromEntities, fromResource } from 'store/selectors'
import { resourceListReadRequest } from 'store/actions'

import { PaymentStatement } from 'components'

class PaymentStatementContainer extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    failed: PropTypes.bool,
    readList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    limit: 20,
  }

  componentWillMount() {
    this.props.readList()
  }

  render() {
    const { list, loading, failed } = this.props
    return <PaymentStatement {...{ list, loading, failed }} />
  }
}

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

const mapStateToProps = state => ({
  list: fromEntities.getList(state, 'PaymentStatement', fromResource.getList(state, 'PaymentStatement')),
  loading: isPending(state, 'PaymentStatementsListRead'),
  failed: hasFailed(state, 'PaymentStatementsListRead'),
})

const mapDispatchToProps = (dispatch, { limit }) => ({
  readList: () => dispatch(resourceListReadRequest('PaymentStatement')),
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentStatementContainer)
