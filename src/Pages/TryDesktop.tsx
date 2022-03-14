import logo from '../logo.svg';
import '../App.css';
import { GetIPCRenderer } from '../NSLib/ElectronAPI';
import { CustomLink } from './Components/CustomLink';

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
          <CustomLink url="https://open.spotify.com/track/6Z8R6UsFuGXGtiIxiD8ISb?si=49aa50e147df4b15"></CustomLink>
        </header>
      </div>
    );
  }