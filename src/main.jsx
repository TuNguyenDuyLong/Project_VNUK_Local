import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './components/Header/Login/UserContext';

createRoot(document.getElementById('root')).render(
  <UserProvider> {/* Bao bọc App trong UserProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
