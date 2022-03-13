import logo from '../logo.svg';
import '../App.css';
import { LoginNewUser } from './AuthHandler';

export default function TD() {
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
          <button onClick={() => {
            LoginNewUser("aidencw01@gmail.com", "1234");
          }}>
          </button>
        </header>
      </div>
    );
  }