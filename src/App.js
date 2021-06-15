import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AnnotationPage from './pages/Annotation/index'
import OldAnnotationPage from './pages/OldAnnotation/index'

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={AnnotationPage}/>
          <Route path="/old" exact component={OldAnnotationPage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
