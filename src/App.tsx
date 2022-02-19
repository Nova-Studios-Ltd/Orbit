import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FromBase64String, FromUint8Array, ToBase64String, ToUint8Array } from './NSLib/Base64';
import { GET } from './NSLib/NCAPI';

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
           // DON'T use "var indexedDB = ..." if you're not in a function.
           // Moreover, you may need references to some window.IDB* objects:
           window.IDBTransaction = window.IDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
           window.IDBKeyRange = window.IDBKeyRange;
           // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
        }}>
          Test
        </button>
      </header>
    </div>
  );
}

export default App;
