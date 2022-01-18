import React from 'react'
import { InputLabel, ListItem, MenuItem, Select } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination';


const DataPagination = (props) => {
  const { page, count, handlePageChange } = props
  return (
    <ListItem>
      <Pagination count={count} page={page} onChange={handlePageChange} size="small"/>
      <InputLabel id='select-page-label' style={{marginRight: 10, marginLeft: 20, fontSize: 15}}>Page</InputLabel>
      <Select
        labelId='select-page-label'
        value={page}
        label='Page'
        onChange={(e) => {
          handlePageChange(e, e.target.value)
        }}
        style={{fontSize: 15}}
      >
        {[...Array(count).keys()].map((pageNum) => (
          <MenuItem value={pageNum+1}>
            {pageNum+1}
          </MenuItem>
        ))}
      </Select>
    </ListItem>
  )
}


export default DataPagination