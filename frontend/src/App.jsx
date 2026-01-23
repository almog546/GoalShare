import { useState, useEffect } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Home from './Home/Home.jsx';

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './CreateGroup/CreateGroup.jsx';
import GroupDashboard from './GroupDashboard/GroupDashboard.jsx';
import GroupPage from './GroupPage/GroupPage.jsx';
import CreateGoal from './CreateGoal/CreateGoal.jsx';
import GoalPage from './GoalPage/GoalPage.jsx';
import AddContribution from './AddContribution/AddContribution.jsx';
import CreateBill from './CreateBill/CreateBill.jsx';
import Billpage from './Billpage/Billpage.jsx';
import InvitePage from './InvitePage/InvitePage.jsx';


function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logout, setLogout] = useState(false);
     const [showText, setShowText] = useState('');
    
    

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
                navigate('/login');
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
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [location]);
     function showTemporaryText(text) {
            setShowText(text);
        
            setTimeout(() => {
              setShowText('');
            }, 2000);
          }
   

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        {showText && <div className="globalToast">{showText}</div>}
            {user && <Navbar user={user} onLogout={onLogout} />}
            <Routes>
                <Route path="/" element={<Home user={user}  />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/create-group"
                    element={!user?( <Navigate to="/signup" replace />) : <CreateGroup  showTemporaryText={showTemporaryText} user={user}  />}
                />
                <Route
                    path="/group-dashboard"
                    element={!user?( <Navigate to="/signup" replace />) : <GroupDashboard user={user} showTemporaryText={showTemporaryText}  />}
                />
                <Route path="/group/:groupid" element={!user?( <Navigate to="/signup" replace />) : <GroupPage showTemporaryText={showTemporaryText}  />} />
                <Route
                    path="/group/:groupid/create-goal"
                    element={!user?( <Navigate to="/signup" replace />) : <CreateGoal showTemporaryText={showTemporaryText}  />}
                />
                <Route
                    path="/group/:groupId/goal/:goalId"
                    element={!user?( <Navigate to="/signup" replace />) : <GoalPage showTemporaryText={showTemporaryText}  />}
                />
                <Route
                    path="/group/:groupId/goal/:goalId/AddContribution/"
                    element={!user?( <Navigate to="/signup" replace />) : <AddContribution showTemporaryText={showTemporaryText}  />}
                />
                <Route
                    path="/group/:groupId/CreateBill/"
                    element={!user?( <Navigate to="/signup" replace />) : <CreateBill showTemporaryText={showTemporaryText}  />}
                />
                <Route
                    path="/group/:groupId/bill/:billId"
                    element={!user?( <Navigate to="/signup" replace />) : <Billpage showTemporaryText={showTemporaryText}  />}
                />
                <Route
                    path="/invite/:token"
                    element={<InvitePage showTemporaryText={showTemporaryText}  />}
                />
            </Routes>
        </>
    );
}

export default App;
