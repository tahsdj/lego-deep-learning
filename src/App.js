import React, { Component } from 'react'
import Board from './containers/Board/'
import Code from './containers/Code/'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board />
        <Code />
      </div>
    );
  }
}

export default App;
