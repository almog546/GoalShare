import { useState, useEffect } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Home from './Home/Home.jsx';
import Logout from './Logout/Logout.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
    const [user, setUser] = useState(null);
    const [logout, setLogout] = useState(false);
    const location = useLocation();
    async function onLogout() {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                setUser(null);
                setLogout(true);
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/me`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }
        }
        fetchUser();
    }, [location]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}

export default App;
