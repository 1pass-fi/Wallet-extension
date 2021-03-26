import React, { Component } from 'react';
import '@polymer/paper-button/paper-button.js';

import './Options.css';

class Options extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Koi
          </a>
          <h1>Your gallery</h1>
          <paper-button toggles raised class="green">toggles</paper-button>
        </header>
      </div>
    );
  }
}

export default Options;
