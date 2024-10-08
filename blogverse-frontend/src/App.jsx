import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Header from './components/Header';
import Search from './pages/Search';
import FooterComponent from './components/FooterComponent';
import EditPost from './pages/EditPost';
import PostPage from './pages/PostPage';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import PrivateRoute from './components/PrivateRoute';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const theme = useSelector(state => state.theme)
  const darkModeToastStyle = {
    backgroundColor: "#2d3748",
    color: "#a0aec0",
  };


  return (
    <Router>
      <ScrollToTop />
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
        <Route path="/search" element={<Search />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterComponent />
    </Router>
  )
}

export default App;
