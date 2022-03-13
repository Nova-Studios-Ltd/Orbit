import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TD from './Pages/TryDesktop';
import { AutoLogin, Manager } from './Pages/AuthHandler';

function App() {
  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (!value) return;
    const loggedIn = await AutoLogin();
    if (loggedIn && !document.location.href.includes("/Chat")) {
      Manager.WriteCookie("LoggedIn", "false");
      document.location.assign("/Chat");
    }
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<>404 Not Found</>}></Route>
        <Route path="/" element={<TD/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
