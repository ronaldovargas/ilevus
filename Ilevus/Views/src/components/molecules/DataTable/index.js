import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table/react-table.js'
import 'react-table/react-table.css'

const DataTable = ({
  list, columns, loading, failed, ...props
}) => {
  return (
    <div>
      <ReactTable
        {...props}
        data={list}
        columns={columns}
      />

    </div>
  )
}

DataTable.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
}

export default DataTable
