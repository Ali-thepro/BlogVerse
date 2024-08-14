import { TextInput, Button, Modal } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app }  from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import Notification  from "./Notifcation"
import { setNotification, hide } from "../redux/reducers/notificationReducer";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { updateUserDetails, deleteUserDetails, signOutUser } from "../redux/reducers/authReducer";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Profile = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)

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
    dispatch(hide())
    setImageUploadLoading(true)
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
          setFormData({ ...formData, profilePicture: downloadURL })
        });
      }
    )
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
    console.log(formData)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (imageUploadLoading) {
      dispatch(setNotification('Image is still uploading', 'failure'))
      return
    }
    if (Object.keys(formData).length === 0) {
      dispatch(setNotification('No changes made', 'failure'))
      return
    }
    dispatch(updateUserDetails({ ...formData, id: user.id }))
  }

  const handleDelete = async () => {
    setShowModal(false)
    dispatch(deleteUserDetails(user.id))
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <TextInput 
          type="email" 
          placeholder="email" 
          defaultValue={user.email}
          name="email"
          onChange={handleChange}
        />
        <TextInput 
          type="password" 
          placeholder="password" 
          name="password"
          onChange={handleChange}
        />
        <Button 
          type="submit" 
          className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" 
          outline
          disabled={loading || imageUploadLoading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span 
          onClick={() => dispatch(signOutUser())}
          className="cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <Notification />

      <Modal 
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-red-500 text-5xl mb-4 mx-auto h-14 w-14"/>
            <h3 className="mb-5 text-lg text-gray 500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button 
                color="failure"
                onClick={handleDelete}
              >
                Yes, I'm sure
              </Button>
              <Button 
                color="gray"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Profile;