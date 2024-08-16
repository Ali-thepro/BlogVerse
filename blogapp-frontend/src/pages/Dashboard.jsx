import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import Profile from '../components/Profile';
import Posts from '../components/Posts';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <SideBar/>
      </div>

      {tab === 'profile' && <Profile />}
      {tab === 'posts' && <Posts />}
    </div>
  )
}

export default Dashboard;