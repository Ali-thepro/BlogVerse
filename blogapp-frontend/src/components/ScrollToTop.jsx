import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hide } from '../redux/reducers/notificationReducer';
import { useDispatch } from 'react-redux';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hide());
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;

