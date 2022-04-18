import logo from '../logo.svg';
import '../App.css';

export default function TD() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            Orbit Web Client
          </h2>
          <p>
            Welcome to Orbit! Orbit is currently under development and is not ready yet. However, when it is, it will be live here.
          </p>
          <p>
            In the meantime, perhaps give our <a
            className="App-link"
            href="https://novastudios.tk/NC3"
            rel="noopener noreferrer"
          >
            Desktop Client
          </a> a try?
          </p>
          <caption>(nvm it's broken)</caption>
        </header>
      </div>
    );
  }