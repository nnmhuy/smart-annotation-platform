import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/CheckCircle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  dataList: {
    padding: 30,
  },
  icon: {
    opacity: 0,
  },
  selectedIcon: {
    opacity: 1,
  },
  dataListItem: {
    cursor: 'pointer'
  },
  selectedItemBar: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.7,
  },
}))

const DataListSection = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const isMobileLayout = useMediaQuery('(max-width:800px)');

  const dataList = useStore(state => state.dataList)
  const setSelectedData = useStore(state => state.setSelectedData)
  const selected = useStore(state => state.selected)

  return (
    <ImageList className={classes.dataList} cols={isMobileLayout ? 2 : 4}>
      {dataList.map(item => {
        const isSelected = selected[item.id]
        return (
          <ImageListItem key={item.id}
            className={classes.dataListItem}
            onClick={() => setSelectedData(item.id, !selected[item.id])}
          >
            <img src={item?.thumbnail?.URL} alt={item.name} />
            <ImageListItemBar
              className={clsx(isSelected && classes.selectedItemBar)}
              title={item.name}
              actionIcon={
                <IconButton
                  aria-label={`check ${item.name}`} 
                  className={clsx(classes.icon, isSelected && classes.selectedIcon)}
                >
                    <CheckIcon 
                      color="secondary"
                    />
                </IconButton>
              }
            />
          </ImageListItem>
        )
      })
      }
    </ImageList>
  )
}


export default DataListSection