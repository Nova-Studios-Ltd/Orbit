import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Init } from './Pages/LoginHandler';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to the homepage of Orbits Web Client, it's not ready yet so please be patient
        </p>
        <a
          className="App-link"
          href="https://novastudios.tk/NC3"
          rel="noopener noreferrer"
        >
          Try Our Desktop Client
        </a>
      </header>
    </div>
  );
}

export default App;
