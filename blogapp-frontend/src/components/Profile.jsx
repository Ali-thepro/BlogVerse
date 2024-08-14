import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app }  from "../firebase";
import { useDispatch } from "react-redux";
import Notification  from "./Notifcation"
import { setNotification } from "../redux/reducers/notificationReducer";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const Profile = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }

  }

  useEffect(() => {
    if (image) {
      uploadImage()
    }
  }, [image])

  const uploadImage = async () => {
    const storage = getStorage(app)
    const filename = new Date().getTime() + image.name
    const storageRef = ref(storage, filename)
    const uploadtask = uploadBytesResumable(storageRef, image)
    uploadtask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      },
      (error) => {
        dispatch(setNotification('could not upload image (must be less than 2 MB)', 'failure'))
        setImageUrl(null)
        setImage(null)
        setImageUploadLoading(false)
        setImageUploadProgress(0)
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL)
          setImageUploadLoading(false)
        });
      }
    )
  }


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} className="hidden"/>
        <div onClick={() => filePickerRef.current.click()} className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">

          <img
            src={imageUrl || user.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && 'opacity-60'}`}
          />
          {imageUploadProgress && (
            <CircularProgressbar value={imageUploadProgress || 0} text={`${imageUploadProgress}%`} 
              strokeWidth={5}
              styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
        </div>
        <TextInput 
          type="text" 
          placeholder="Username" 
          defaultValue={user.username}
          name="username"
        />
        <TextInput 
          type="email" 
          placeholder="email" 
          defaultValue={user.email}
          name="email"
        />
        <TextInput 
          type="password" 
          placeholder="password" 
          name="password"
        />
        <Button type="submit" className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <Notification />
    </div>
  )
}

export default Profile;