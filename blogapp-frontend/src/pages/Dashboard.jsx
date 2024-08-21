import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hide } from '../redux/reducers/notificationReducer';
import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';
import DashboardComments from '../components/DashboardComments';
import DashboardOverview from '../components/DashboardOverview';

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    dispatch(hide());
  }, [tab, dispatch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <SideBar/>
      </div>

      {tab === 'dash' && <DashboardOverview />} 
      {tab === 'profile' && <DashboardProfile />}
      {tab === 'posts' && <DashboardPosts />}
      {tab === 'users' && <DashboardUsers />}
      {tab === 'comments' && <DashboardComments />}
    </div>
  )
}

export default Dashboard;