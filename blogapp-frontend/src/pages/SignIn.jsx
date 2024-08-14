import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { login } from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../components/Notifcation";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await dispatch(login({ email: formData.email, password: formData.password }));

    if (success) {
      navigate('/');
    }

  }


  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-12">
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span>Blog</span>
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg text-white">Verse</span>
          </Link>
          <p className="text-sm mt-5">
            This is a blog app where you can share your thoughts and ideas with the world. You can 
            sign in with your email and password or with Google.
          </p>

        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label>Your email</Label>
              <TextInput 
                type="email" 
                placeholder="name@company.com" 
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label>Your password</Label>
              <TextInput 
                type="password" 
                placeholder="Password" 
                name="password"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg" outline disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="w-6 h-6" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>
          </div>
          <Notification />
        </div>
      </div>
    </div>
  )
}

export default SignIn;