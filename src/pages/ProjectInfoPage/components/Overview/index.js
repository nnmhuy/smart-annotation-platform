import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import { withFormik, Field } from 'formik';
import * as Yup from 'yup'
import { get, cloneDeep } from 'lodash'

import NakedField from '../../../../components/NakedField'

import ProjectClass from '../../../../models/ProjectClass'


const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    background: theme.palette.primary.light,
    padding: 20,
  },
  projectName: {
    fontSize: 30,
  },
  projectDescription: {
    marginTop: 20,
    lineHeight: 1.5,
    color: theme.palette.primary.dark,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: theme.palette.primary.dark,
  }
}))

const Overview = (props) => {
  const classes = useStyles()
  const { 
    useStore, 
    values, setFieldValue,
    errors,
    setSubmitting, setErrors
  } = props

  const project = useStore(state => state.project)
  const updateProjectInfo = useStore(state => state.updateProjectInfo)

  React.useEffect(() => {
    const { name, description } = project
    setFieldValue("name", name)
    setFieldValue("description", description)
  }, [project, setFieldValue])

  const handleSubmit = async () => {
    let data = cloneDeep(values)
    Object.keys(data).forEach(key => {
      if (errors[key]) {
        data[key] = project[key]
      }
    })

    const newDataset = new ProjectClass(project.id, data.name, data.description)

    try {
      await updateProjectInfo(newDataset)
    } catch (error) {
      const errMessage = get(error, 'data.errors.json.project', '')
      setErrors({ error: errMessage })
    }
    setSubmitting(false)
  }

  return (
    <Grid container className={classes.overviewContainer}>
      <Grid container item xs={10} direction="column" alignItems="flex-start">
        <Field
          name={'name'}
          component={NakedField}
          className={classes.projectName}
          fullWidth
          onBlur={handleSubmit}
          placeholder={project.name}
        />  
        <Field
          name={'description'}
          component={NakedField}
          className={classes.projectDescription}
          fullWidth
          multiline
          onBlur={handleSubmit}
          placeholder={project.description || "Add project description"}
        />
        <div className={classes.date}>
          {moment(project.date_created).format('MMMM Do YYYY, HH:mm')}
        </div>
      </Grid>
      <Grid container item xs={2} justifyContent="flex-end" alignItems="flex-start">
        <IconButton
          href={`/projects`}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>

  )
}


const ProjectInfoForm = withFormik({
  mapPropsToValues: () => ({ name: '', description: '' }),

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string()
  }),
})(Overview);

export default ProjectInfoForm