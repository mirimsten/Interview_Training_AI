import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LogIn';
import SignUp from './components/SignUp';
import Home from './components/Home';

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
          element={<Home /> }
        />
        
        {/* ניתוב ברירת מחדל */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
