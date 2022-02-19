import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AESMemoryEncryptData } from './NSLib/NSEncrytUtil';
import { FromBase64String, FromUint8Array, ToBase64String, ToUint8Array } from './NSLib/Base64';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={async () => {
          const d = ToBase64String(ToUint8Array("Test"));
          console.log(d);
          console.log(FromUint8Array(FromBase64String(d)));
        }}>
          Test
        </button>
      </header>
    </div>
  );
}

export default App;
