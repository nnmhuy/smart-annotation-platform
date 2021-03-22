import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { InvisibleIcon, VisibleIcon } from './SidebarIcon'

const styles = {
  icon: {
    width: 15,
    height: 15
  }
}


const columns = [
  { field: 'id', headerName: 'ID', width: 30 },
  { field: 'label', headerName: 'Class', width: 50 },
]

const ClassList = (props) => {
  const { annotationClasses, setAnnotationClasses } = props

  const toggleVisibility = (id) => {
    const newAnnotationClasses = annotationClasses.map((c) => {
      return {
        ...c,
        isHidden: c.id === id ? !c.isHidden : c.isHidden
      }
    })
    setAnnotationClasses(newAnnotationClasses)
  }

  return (
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
        {annotationClasses.map((row) => (
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
  )
}

export default ClassList