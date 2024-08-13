import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../redux/reducers/authReducer';


const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const success = dispatch(googleLogin({
        name: result.user.displayName,
        email: result.user.email,
        googlePhotoURL: result.user.photoURL,
      }));

      if (success) {
        navigate('/');
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button type='button' className="focus:ring-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" outline onClick={handleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}

export default OAuth;