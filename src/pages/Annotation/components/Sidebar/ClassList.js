import React from 'react'
import clsx from 'clsx';
import { InvisibleIcon, VisibleIcon } from './SidebarIcon'

import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons';

const styles = {
  icon: {
    width: 15,
    height: 15
  }
}

const useStyles = makeStyles((theme) => ({
  showClassWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: 'white'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));


const columns = [
  { field: 'id', headerName: 'ID', width: 30 },
  { field: 'type', headerName: 'Type', width: 50 },
]

const ClassList = (props) => {
  const { annotations, classLabel } = props
  const [expanded, setExpanded] = React.useState(true)
  const [annotationDisplay, setAnnotationDisplay] = React.useState([])
  const classes = useStyles();
  const toggleVisibility = (id) => {
    const newAnnotationDisplay = annotations.map((c) => {
      return {
        isHidden: c.id === id ? !c.isHidden : c.isHidden
      }
    })
    setAnnotationDisplay(newAnnotationDisplay)
  }


  const rows = annotations.map((annotation, index) => {
    return {
      id: annotation.id.slice(0, 5),
      type: annotation.type,
      isHidden: annotationDisplay[index]
    }
  })
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className={classes.showClassWrapper}>
        <label>
          {classLabel}
        </label>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Divider/>
      {(rows.length !== 0) && <Collapse in={expanded}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.headerName}
                </TableCell>
              ))}
              <TableCell>
                <div style={styles.icon}>
                  {VisibleIcon}
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {row[`${column.field}`]}
                  </TableCell>
                ))}
                <TableCell>
                  <div style={styles.icon} onClick={() => toggleVisibility(row.id)}>
                    {row.isHidden ? InvisibleIcon : VisibleIcon}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>}
    </>
  )
}

export default ClassList