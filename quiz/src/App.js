import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Home from './Home';
import Topics from './Topics'
import Quiz from './Quiz';
import Results from './Results';
import detailedResults from './detailedResults';

function App() {
  return (
    <Router>
    <div>
      <Route path="/home" component={Home} />
      <Route path="/topics" component={Topics} />
      <Route path="/quiz" component={Quiz} />
      <Route path='/results' component={Results} />
      <Route path='/detailedResults' component={detailedResults} />
    </div>
  </Router>
  );
}

export default App;
