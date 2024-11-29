import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/pages/LogIn';
import SignUp from '../src/pages/SignUp';
import Home from '../src/pages/Home';
import PreviousInterviews from './pages/PreviousInterviews';
// רכיב App שמנהל ניתובים
function App() {
  //const [isAuthenticated, setIsAuthenticated] = React.useState(false); // ניהול מצב התחברות

  // פונקציה לדמות התחברות
  //   const handleLogin = () => {
  //     setIsAuthenticated(true);
  //   };

  return (
    <BrowserRouter>
      <Routes>
        {/* ניתוב לעמוד הכניסה */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ניתוב לעמוד ההרשמה */}
        <Route
          path="/signup"
          element={<SignUp />}
        />

        {/* ניתוב לעמוד הבית - מחייב התחברות */}
        <Route
          path="/home"
          element={<Home />}
        />

        {/* ניתוב ברירת מחדל */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      <Route
        path="/previousInterviews"
        element={<PreviousInterviews/>}


      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
