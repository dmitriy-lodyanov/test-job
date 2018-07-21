import React, { Component } from 'react';
import './App.scss';
import Companies from './components/Companies';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Companies/>
      </div>
    );
  }
}

export default App;
