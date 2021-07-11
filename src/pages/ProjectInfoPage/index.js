import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams } from 'react-router'

import Loading from '../../components/Loading'
import Overview from './components/Overview/index'
import ProjectTabs from './components/Tabs/index'
import TabPanel from './components/TabPanel/index'
import DatasetList from './components/DatasetList/index'
import LabelList from './components/LabelList/index'
import Export from './components/Export/index'
import Settings from './components/Settings/index'

import useProjectInfoStore from './store'

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

const ProjectInfoPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = React.useState(0);

  const isLoading = useProjectInfoStore(state => state.isLoading)
  const getProjectInfo = useProjectInfoStore(state => state.getProjectInfo)

  React.useEffect(() => {
    getProjectInfo(projectId)
  }, [])


  const handleChangeIndex = (index) => {
    setActiveTab(index);
  };

  return (
    <div className={classes.root}>
      <Loading isLoading={isLoading}/>
      <Overview
        useStore={useProjectInfoStore}
      />
      <ProjectTabs
        value={activeTab}
        setValue={setActiveTab}
      />
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeTab}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <DatasetList useStore={useProjectInfoStore}/>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <LabelList useStore={useProjectInfoStore}/>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Export useStore={useProjectInfoStore} />
        </TabPanel>
        <TabPanel value={activeTab} index={3} dir={theme.direction}>
          <Settings useStore={useProjectInfoStore} />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}


export default ProjectInfoPage