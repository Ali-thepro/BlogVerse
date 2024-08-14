import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import FooterComponent from './components/FooterComponent';
import PrivateRoute from './components/PrivateRoute';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export default function App() {
  const theme = useSelector(state => state.theme)
  const darkModeToastStyle = {
    backgroundColor: "#2d3748",
    color: "#a0aec0",
  };


  return (
    <Router>
      <Header />
      <ToastContainer 
        position="top-right"
        className="toast-position"
        pauseOnFocusLoss={false}
        toastStyle={theme === 'dark' ? darkModeToastStyle : {}}
        draggable={true}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterComponent />
    </Router>
  )
}