import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // שליפת שם המשתמש מ-localStorage
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser.name); // עדכון השם
        }
    }, []); // הרצת הפונקציה פעם אחת בלבד בעת טעינת הקומפוננטה

    return (
        <nav className="navbar">
            <h1 className="navbar-logo">MyApp</h1>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            {userName && (
                <div className="navbar-user">
                    <span>Welcome, {userName}!</span>
                </div>
            )}
        </nav>
    );
};

export default NavBar;