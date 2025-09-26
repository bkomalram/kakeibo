import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import ExpenseTracker from './pages/ExpenseTracker';
import Authenticate from './pages/Authenticate';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './context/AuthenticateContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Authenticate />} />
        <Route path="/expense-tracker" element={<ExpenseTracker />} />
      </Routes>
    </Router>
  </AuthProvider>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
