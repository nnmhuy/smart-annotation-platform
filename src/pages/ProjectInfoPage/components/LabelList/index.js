import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'
import { get, cloneDeep } from 'lodash'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/HighlightOff';
import CreateIcon from '@material-ui/icons/AddCircle';

import EditLabelDialog from './components/EditLabelDialog';
import { ColorCell } from './components/ColorCell'

import LabelClass from '../../../../classes/LabelClass'
import randomColor from '../../../../utils/randomColor'

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
  const createLabel = useStore(state => state.createLabel)
  const updateLabel = useStore(state => state.updateLabel)
  const deleteLabel = useStore(state => state.deleteLabel)

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingLabel, setEditingLabel] = React.useState({})

  React.useEffect(() => {
    getLabels(projectId)
  }, [])

  const handleTriggerEditLabel = (label) => () => {
    setEditingLabel(cloneDeep(label))
    setOpenDialog(true)
  }

  const handleTriggerCreateLabel = () => {
    const newLabel = new LabelClass('', 'custom label', projectId, {}, {
      fill: randomColor,
      stroke: '#000000'
    })
    setEditingLabel(newLabel)
    setOpenDialog(true)
  }


  const handleSaveEditDialog = (finishedLabel) => {
    if (finishedLabel.id) {
      updateLabel(finishedLabel)
    } else {
      createLabel(finishedLabel)
    }
    setOpenDialog(false)
  }

  const handleTriggerDeleteLabel = (label) => () => {
    deleteLabel(label)
  }


  return (
    <div className={classes.labelListContainer}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 15, marginBottom: 15, }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<CreateIcon />}
          onClick={handleTriggerCreateLabel}
        >
          New label
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(col => {
              const { headerName, field, align } = col
              return (
                <TableCell key={`column-header-${field}-${headerName}`} align={align}>
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
                  onClick={handleTriggerEditLabel(label)}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton
                  color="secondary"
                  onClick={handleTriggerDeleteLabel(label)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
          }
        </TableBody>
      </Table>
      <EditLabelDialog
        open={openDialog}
        setOpen={setOpenDialog}
        handleSave={handleSaveEditDialog}
        label={editingLabel}
      />
    </div>
  );
}

export default LabelList