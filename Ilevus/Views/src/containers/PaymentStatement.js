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

const mapStateToProps = state => ({
  list: fromEntities.getList(state, 'posts', fromResource.getList(state, 'posts')),
  loading: isPending(state, 'postsListRead'),
  failed: hasFailed(state, 'postsListRead'),
})

const mapDispatchToProps = (dispatch, { limit }) => ({
  readList: () => dispatch(resourceListReadRequest('posts', { _limit: limit })),
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentStatementContainer)
