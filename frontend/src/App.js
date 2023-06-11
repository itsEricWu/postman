import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './stores';
import LoginPage from './views/LoginPage';
import SignUpPage from './views/SignupPage/SignUpPage';
import HomePage from './views/HomePage';
import ChatPage from './views/ChatPage';
import ProgressPage from './views/ProgressPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import RatePage from './views/RatePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/task-progress" element={<ProgressPage />} />
            <Route path="/rate-task" element={<RatePage />} />
            <Route path="/chatpage" element={<ChatPage />} />
            <Route path="/profilepage" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
