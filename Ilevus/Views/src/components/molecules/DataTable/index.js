import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
// import 'react-table/react-table.css'

const DataTable = ({
  list, columns, loading, failed, ...props
}) => {
  return (
    <div>
      {!list.length && loading && <div>Loading</div>}
      {failed && <div>Something went wrong while fetching posts. Please, try again later.</div>}
      {!list.length > 0 && !loading && <ReactTable
        {...props}
        data={list}
        columns={columns}
      />
      }
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
