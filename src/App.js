import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AnnotationPage from './pages/Annotation/index'

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={AnnotationPage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
