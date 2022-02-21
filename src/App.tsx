import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SettingsManager } from './NSLib/SettingsManager';

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
          const sett = new SettingsManager();
          sett.WriteSetting("test", 12345);
          console.log(await sett.ConstainsSetting("test"));
          console.log(await sett.ReadSetting<number>("test"));
          sett.DeleteSetting("test");
          console.log(await sett.ConstainsSetting("test"));
        }}>
          Test
        </button>
      </header>
    </div>
  );
}

export default App;
