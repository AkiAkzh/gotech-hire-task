import React, { useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from './config';

export default function App() {
  const [token, setToken] = useState<string>(localStorage.getItem(STORAGE_KEYS.token) || '');
  const [userId, setUserId] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.userId)) || 0);

  const socket = useMemo(() => {
    if (!token) return null;
    return io(API_BASE_URL, {
      auth: { token },
    });
  }, [token]);

  const handleLogin = (nextToken: string, nextUserId: number) => {
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.userId, String(nextUserId));
    setToken(nextToken);
    setUserId(nextUserId);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.userId);
    setToken('');
    setUserId(0);
    socket?.disconnect();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.login}
          element={token ? <Navigate to={ROUTES.chat} replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path={ROUTES.register}
          element={token ? <Navigate to={ROUTES.chat} replace /> : <RegisterPage onRegister={handleLogin} />}
        />
        <Route
          path={ROUTES.chat}
          element={
            token && socket ? (
              <ChatPage
                token={token}
                userId={userId}
                socket={socket}
                apiUrl={API_BASE_URL}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to={ROUTES.login} replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={token ? ROUTES.chat : ROUTES.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}