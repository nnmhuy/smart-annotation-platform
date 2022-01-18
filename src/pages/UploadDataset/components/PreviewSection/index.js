import React from 'react'
import { Collapse, LinearProgress, makeStyles, withStyles, styled, IconButton, Divider } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Grid from '@material-ui/core/Grid'
import _ from 'lodash'

import ImagePreview from './components/ImagePreview/index'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 30 0 30px',
    margin: 'auto',
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    color: theme.palette.primary.dark
  },
  collapseTitle: {
    margin: 'auto',
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 1200,
    fontSize: 25,
    display: 'flex',
    justifyContent: 'space-around'
  }
}))

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: (props) => ({
    borderRadius: 5,
    backgroundColor: props.status === "error" ? 'red' : (props.status === "uploading" ? '#1a90ff' : "green"),
  }),
}))(LinearProgress);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PreviewSection = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const [expandedSuccess, setExpandedSuccess] = React.useState(false);
  const [expandedFailed, setExpandedFailed] = React.useState(false);

  const handleExpandSuccessClick = () => {
    setExpandedSuccess(!expandedSuccess);
  };
  const handleExpandFailedClick = () => {
    setExpandedFailed(!expandedFailed);
  };
  const files = useStore(state => state.files)
  const uploadLogs = useStore(state => state.uploadLogs)
  const progressInfos = useStore(state => state.progressInfos)
  const deleteFileById = useStore(state => state.deleteFileById)
  // console.log(uploadLogs)
  const uploadLogsKey = files.map(file => file.id)
  const countSuccess = uploadLogsKey.filter((logId => _.get(uploadLogs[logId], 'success', false))).length
  return (
    files.length ?
      <Grid container direction="row" spacing={2} className={classes.root} justifyContent='center'>
        <Grid item className={classes.title} xs={12}>
          File list
        </Grid>
        <Grid item xs={7}>
            <BorderLinearProgress  variant="determinate" value={countSuccess / uploadLogsKey.length * 100}></BorderLinearProgress>
            <label>{countSuccess}/{uploadLogsKey.length}</label>
        </Grid>
        <Grid item xs={11}>
          <div className={classes.collapseTitle}> 

            <label>Upload Successful</label>
            <ExpandMore
              expand={expandedSuccess}
              onClick={handleExpandSuccessClick}
              aria-expanded={expandedSuccess}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>
          <Collapse in={expandedSuccess} timeout="auto" unmountOnExit>
            <Grid container direction='row' spacing={2}>
              {
                files.map((file, index) => _.get(uploadLogs[file.id], 'success', false) && (
                  <Grid item xs={2}>
                    <ImagePreview
                      useStore={useStore}
                      key={`${index}-${file.name}`}
                      index={index}
                      file={file}
                      log={uploadLogs[file.id]}
                      progress={progressInfos[file.id]}
                      deleteFileById={deleteFileById}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Collapse>    
        </Grid>
        <Grid item xs={11}>
          <div className={classes.collapseTitle}> 
            <label>Upload Failed</label>
            <ExpandMore
              expand={expandedFailed}
              onClick={handleExpandFailedClick}
              aria-expanded={expandedFailed}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>

          <Collapse in={expandedFailed} timeout="auto" unmountOnExit>
            <Grid container direction='row' spacing={2}>
              {
                files.map((file, index) => !_.get(uploadLogs[file.id], 'success', false) && (
                  <Grid item xs={2}>
                    <ImagePreview
                      useStore={useStore}
                      key={`${index}-${file.name}`}
                      index={index}
                      file={file}
                      log={uploadLogs[file.id]}
                      progress={progressInfos[file.id]}
                      deleteFileById={deleteFileById}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Collapse>    
        </Grid>
      </Grid>
      : null
  )
}

export default PreviewSection