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
            Welcome to Orbit! Orbit is currently under development and is not ready yet. When it is, it will be live here.
          </p>
          <p>
            In the meantime, you can try our open beta of Orbit <span
            className="App-link"
            onClick={() => document.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          >
            here
          </span>.
          </p>
        </header>
      </div>
    );
  }