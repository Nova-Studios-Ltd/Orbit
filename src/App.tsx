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
        <input type="text" id="email"></input>
        <input type="text" id="password"></input>
        <button onClick={() => {
          /*const email = document.getElementById("email");
          const password = document.getElementById("password");
          if (email === null || password === null) return;
          Init((email as any).value, (password as any).value);*/
          Init("aidencw01@gmail.com", "1234");
        }}>Submit</button>
      </header>
    </div>
  );
}

export default App;
