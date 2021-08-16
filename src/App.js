import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';

import Layout from './components/Layout/index'

import ProjectListPage from './pages/ProjectList/index'
import ProjectInfoPage from './pages/ProjectInfoPage/index'
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
      darker: '#212933',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffc074',
      light: '#ffddb5',
      lighter: '#ffefdb',
    },
    error: {
      main: '#E91D00'
    }
  },
});

const appRoutes = [
  {
    path: ["/", "/projects"],
    component: ProjectListPage,
    withLayout: true,
  },
  {
    path: "/projects/project=:projectId",
    component: ProjectInfoPage,
    withLayout: true,
  },
  {
    path: "/datasets/dataset=:datasetId",
    component: DatasetManagementPage,
    withLayout: true,
  },
  {
    path: "/datasets/upload/dataset=:datasetId",
    component: UploadDatasetPage,
    withLayout: true,
  },
  {
    path: "/annotations/dataset=:datasetId",
    component: AnnotationPage,
    withLayout: false,
  },
]

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <ConfirmProvider>
        <div className="App">
          <Router>
            <Switch>
              {appRoutes.map(route => {
                const { withLayout, exact = true, path, component: Component, ...others } = route
                return (
                  <Route 
                    key={path}
                    path={path}
                    exact={exact} 
                    render={() => (
                      withLayout ?
                        <Layout>
                          <Component/>
                        </Layout>
                      : <Component/>
                    )}
                    {...others}
                  />
                )
              })}
            </Switch>
          </Router>
        </div>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;
