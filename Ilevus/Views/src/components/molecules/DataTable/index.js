import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
// import 'react-table/react-table.css'

const DataTable = ({
  data, columns, ...props
}) => {
  return (
    <ReactTable
      {...props}
      data={data}
      columns={columns}
    />
  )
}

DataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
}

export default DataTable
