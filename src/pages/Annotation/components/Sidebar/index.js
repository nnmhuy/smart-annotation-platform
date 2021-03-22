import { Icon, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import React, { Component } from 'react'
import { theme } from '../../../../theme'
import { InvisibleIcon, VisibleIcon } from './SidebarIcon'


const columns = [
  { field: 'id', headerName: 'ID', width: 30 },
  { field: 'label', headerName: 'Class', width: 50 },
]

const styles = {
  sideBarWrapper: {
    width: '100%',
    backgroundColor: theme.light.backgroundColor
  },
  icon: {
    width: 15,
    height: 15
  }
}

export default class Sidebar extends Component {
  render() {
    const { data } = this.props
    return (
      <div style={styles.sideBarWrapper}>
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
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {row[`${column.field}`]}
                  </TableCell>
                ))}
                <TableCell>
                  <div style={styles.icon} onClick={() => this.toggleVisibility(row.id)}>
                    {row.isHidden ? InvisibleIcon : VisibleIcon}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  toggleVisibility = (id) => {
    const { handleToggleVisibility } = this.props
    handleToggleVisibility(id)
  }
}
