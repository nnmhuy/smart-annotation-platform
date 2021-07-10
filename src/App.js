import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import ProjectListPage from './pages/ProjectList/index'
import ProjectInfoPage from './pages/ProjectInfoPage/index'
import ProjectCreatePage from './pages/ProjectCreate/index'
import DatasetManagementPage from './pages/DatasetManagement/index'
import UploadDatasetPage from './pages/UploadDataset/index'
import AnnotationPage from './pages/Annotation/index'

import './App.css';

const appTheme = createTheme({
  palette: {
    primary: {
      light: '#eef2f7',
      main: '#2876D4',
      dark: '#49535f',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffc074',
      light: '#ffddb5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact render={() => <Redirect to='/projects'/>} />
            <Route path="/projects" exact component={ProjectListPage} />
            <Route path="/projects/project=:projectId" exact component={ProjectInfoPage} />
            <Route path="/projects/create" exact component={ProjectCreatePage} />
            <Route 
              path={[
                "/datasets/dataset=:datasetId?page=:page",
                "/datasets/dataset=:datasetId",
              ]} 
              exact 
              component={DatasetManagementPage} 
            />
            <Route path="/datasets/upload/dataset=:datasetId" exact component={UploadDatasetPage} />
            <Route path="/annotations/project=:projectId&dataset=:datasetId" exact component={AnnotationPage}/>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
