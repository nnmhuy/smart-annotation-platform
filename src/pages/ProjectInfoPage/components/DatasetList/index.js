import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@material-ui/core'
import { get } from 'lodash'
import moment from 'moment'

import EditIcon from '@material-ui/icons/Edit';
import CreateIcon from '@material-ui/icons/AddCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import CreateDatasetDialog from './components/CreateDatasetDialog'

const useStyles = makeStyles(() => ({

}))

const tableColumns = [
  {
    key: 'name', label: 'Name'
  },
  {
    key: 'instances', label: 'Instances'
  },
  {
    key: 'date_created', label: 'Created at',
    formatter: (value) => moment(value).format('MMMM Do YYYY, HH:mm')
  },
]

const DatasetList = (props) => {
  const classes = useStyles()
  const { projectId } = useParams()
  const { useStore } = props

  const datasets = useStore(state => state.datasets)
  const getDatasets = useStore(state => state.getDatasets)
  const appendNewDataset = useStore(state => state.appendNewDataset)
  
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    getDatasets(projectId)
  }, [])

  const handleTriggerCreateDataset = () => {
    setOpenDialog(true)
  }

  const handleCreateDataset = (newDataset) => {
    appendNewDataset(newDataset)
  }

  return (
    <div className={classes.datasetListContainer}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 15, marginBottom: 15, }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<CreateIcon />}
          onClick={handleTriggerCreateDataset}
        >
          New Dataset
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(col => (
                <TableCell key={col.key}>
                  {col.label}
                </TableCell>
            ))}
            <TableCell align='center'>
              Edit
            </TableCell>
            <TableCell align='center'>
              Annotate
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datasets.map(dataset => (
            <TableRow
              key={`dataset-${dataset.id}`}
            >
              {tableColumns.map(col => {
                const colValue = get(dataset, col.key, '')
                return (
                  <TableCell key={`dataset-${dataset.id}-col-${col.key}`}>
                    {col.formatter ? col.formatter(colValue) : colValue}
                  </TableCell>
                )
              })}
              <TableCell align='center'>
                <IconButton 
                  color="primary" 
                  component="a"
                  href={`/datasets/dataset=${dataset.id}`}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton 
                  color="secondary" 
                  component="a"
                  href={`/annotations/project=${projectId}&dataset=${dataset.id}`}
                >
                  <PlayCircleFilledIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
          }
        </TableBody>
      </Table>
      <CreateDatasetDialog
        projectId={projectId}
        open={openDialog}
        setOpen={setOpenDialog}
        handleCreate={handleCreateDataset}
      />
    </div>
  )
}

export default DatasetList