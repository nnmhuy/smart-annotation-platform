import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  searchField: {
    width: '100%',
  }
}))

const SearchField = (props) => {
  const classes = useStyles()
  const { handleChange } = props

  return (
    <TextField
      className={classes.searchField}
      variant='outlined'
      onChange={handleChange}
      placeholder='Search projects'
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        ),
      }}
    />
  )
}


export default SearchField