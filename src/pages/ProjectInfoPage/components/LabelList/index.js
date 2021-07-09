import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'
import { get } from 'lodash'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/HighlightOff';

import { ColorCell } from './components/ColorCell'

const useStyles = makeStyles(() => ({
  labelListContainer: {
    width: '100%',
  },
  dataGrid: {
  }
}))

const tableColumns = [
  { field: 'label', headerName: 'Label', },
  {
    field: 'annotationProperties.fill', headerName: 'Fill color',
    component: ColorCell
  },
  {
    field: 'annotationProperties.stroke', headerName: 'Stroke color',
    component: ColorCell
  },
  { field: '', headerName: 'Edit', align: 'center' },
  { field: '', headerName: 'Delete', align: 'center' },
];

const LabelList = (props) => {
  const classes = useStyles()
  const { projectId } = useParams()
  const { useStore } = props


  const labels = useStore(state => state.labels)
  const getLabels = useStore(state => state.getLabels)
  const updateLabel = useStore(state => state.updateLabel)

  React.useEffect(() => {
    getLabels(projectId)
  }, [])


  return (
    <div className={classes.labelListContainer}>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(col => {
              const { headerName, field, align } = col
              return (
                <TableCell key={`column-header-${field}`} align={align}>
                  {headerName}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {labels.map(label => (
            <TableRow
              key={`label-${label.id}`}
            >
              {tableColumns.map(col => {
                const { formatter, component: RenderComponent, align, field } = col

                if (!field) {
                  return null
                }

                const colValue = get(label, field, '')
                const formattedValue = formatter ? formatter(colValue) : colValue
                return (
                  <TableCell
                    key={`label-${label.id}-col-${col.field}`}
                    align={align}
                  >
                    {RenderComponent ?
                      <RenderComponent value={formattedValue} /> :
                      formattedValue
                    }
                  </TableCell>
                )
              })}
              <TableCell align='center'>
                <IconButton
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

export default LabelList