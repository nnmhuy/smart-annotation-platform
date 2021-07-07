import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AnnotationPage from './pages/Annotation/index'

import './App.css';

const appTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2876D4',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffddb5',
      light: '#faf1e6'
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/annotations:project=:projectId&dataset=:datasetId" exact component={AnnotationPage}/>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
