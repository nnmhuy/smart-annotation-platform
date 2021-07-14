import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { useParams, useHistory } from 'react-router'
import { useConfirm } from 'material-ui-confirm'
import { withFormik, Field } from 'formik';
import * as Yup from 'yup'
import { get, cloneDeep } from 'lodash'

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

import NakedField from '../../../../components/NakedField'
import SettingsMenu from './components/SettingsMenu'

import DatasetClass from '../../../../classes/DatasetClass'
import useQuery from '../../../../utils/useQuery'

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.light,
    padding: 20,
  },
  name: {
    fontSize: 30,
  },
  description: {
    marginTop: 20,
    lineHeight: 1.5,
    color: theme.palette.primary.dark,
  },
  instances: {
    marginTop: 10,
    fontSize: 12,
    color: theme.palette.primary.dark,
  },
  button: {
    height: 'fit-content'
  }
}))

const DatasetInfo = (props) => {
  const classes = useStyles()
  const history = useHistory()
  const confirm = useConfirm()
  const { datasetId } = useParams()
  const query = useQuery()
  const {
    useStore,
    values, setFieldValue,
    errors,
    setSubmitting, setErrors
  } = props

  const page = JSON.parse(query.get("page") || 1)

  const dataset = useStore(state => state.dataset)
  const deleteDataset = useStore(state => state.deleteDataset)
  const updateDatasetInfo = useStore(state => state.updateDatasetInfo)

  const { projectId, datatype, instances, } = dataset

  React.useEffect(() => {
    const { name, description } = dataset
    setFieldValue("name", name)
    setFieldValue("description", description)
  }, [dataset, setFieldValue])

  const handleSubmit = async () => {
    let data = cloneDeep(values)
    Object.keys(data).forEach(key => {
      if (errors[key]) {
        data[key] = dataset[key]
      }
    })

    const newDataset = new DatasetClass(dataset.id, data.name, projectId, data.datatype, { description: data.description })

    try {
      await updateDatasetInfo(newDataset)
    } catch (error) {
      const errMessage = get(error, 'data.errors.json.dataset', '')
      setErrors({ error: errMessage })
    }
    setSubmitting(false)
  }

  const [settingAnchorEl, setSettingAnchorEl] = React.useState(null);

  const handleClickSettingMenu = (event) => {
    setSettingAnchorEl(event.currentTarget);
  };

  const handleCloseSettingMenu = () => {
    setSettingAnchorEl(null);
  };

  const handleClickDeleteDataset = async () => {
    confirm({
      title: 'Delete dataset',
      description: `This action can't be undone and will delete all images and annotations belong to this dataset`
    }).then(async () => {
      await deleteDataset(datasetId)
      history.replace(`/projects/project=${projectId}`)
    })
  }

  return (
    <Grid container className={classes.root}>
      <Grid container item xs={6} md={8} direction="column" alignItems="flex-start">
        <Field
          name={'name'}
          component={NakedField}
          className={classes.name}
          fullWidth
          onBlur={handleSubmit}
          placeholder={dataset.name}
        />
        <Field
          name={'description'}
          component={NakedField}
          className={classes.description}
          fullWidth
          onBlur={handleSubmit}
          placeholder={dataset.description || "Add dataset description"}
        />
        <div className={classes.datatype}>Datatype: {datatype}</div>
        <div className={classes.instances}>{instances} instances</div>
      </Grid>
      <Grid container item xs={6} md={4} alignItems="center">
        <Grid container item xs={12} spacing={1} alignItems="center" justifyContent="flex-end">
          <Grid item>
            <IconButton onClick={handleClickSettingMenu}>
              <SettingsIcon />
            </IconButton>
            <SettingsMenu
              anchorEl={settingAnchorEl}
              handleClickDelete={handleClickDeleteDataset}
              handleClose={handleCloseSettingMenu}
            />
          </Grid>
          <Grid item>
            <IconButton href={`/projects/project=${projectId}`}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1} alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Button
              variant="outlined" className={classes.button}
              color="primary"
              startIcon={<AddIcon />}
              href={`/annotations/project=${projectId}&dataset=${datasetId}?page=${page}`}
            >
              Start annotate
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined" className={classes.button}
              color="primary"
              startIcon={<AddIcon />}
              href={`/datasets/upload/dataset=${datasetId}`}
            >
              Add data
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const DatasetInfoForm = withFormik({
  mapPropsToValues: () => ({ 
    name: '', 
    description: '' 
  }),

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string()
  }),
})(DatasetInfo);

export default DatasetInfoForm