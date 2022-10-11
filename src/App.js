import './App.css'
import logo from './logo.svg';
import { useEffect } from 'react';




function App() {
  const UPDATE_CHECK_INTERVAL = 1 * 60 * 1000
  useEffect(() => {
 
  }, [UPDATE_CHECK_INTERVAL])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Chalega Gya Sala.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
