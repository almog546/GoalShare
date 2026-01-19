import { useState, useEffect } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Home from './Home/Home.jsx';

import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './CreateGroup/CreateGroup.jsx';
import GroupDashboard from './GroupDashboard/GroupDashboard.jsx';
import GroupPage from './GroupPage/GroupPage.jsx';
import CreateGoal from './CreateGoal/CreateGoal.jsx';
import GoalPage from './GoalPage/GoalPage.jsx';

function App() {
    const nabvigate = useNavigate();
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
                },
            );
            if (res.ok) {
                setUser(null);
                setLogout(true);
                nabvigate('/login');
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
                    },
                );
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
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
            {user && <Navbar user={user} onLogout={onLogout} />}
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/create-group"
                    element={<CreateGroup user={user} />}
                />
                <Route
                    path="/group-dashboard"
                    element={<GroupDashboard user={user} />}
                />

                <Route path="/group/:groupid" element={<GroupPage />} />
                <Route
                    path="/group/:groupid/create-goal"
                    element={<CreateGoal />}
                />
                <Route
                    path="/group/:groupId/goal/:goalId"
                    element={<GoalPage />}
                />
            </Routes>
        </>
    );
}

export default App;
