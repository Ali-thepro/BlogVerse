import { TextInput, FileInput, Button } from "flowbite-react";
import ReactQuill from "react-quill";
import { modules, formats } from "../utils/quill";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CategoryDropdown from "../components/CategoryDropdown";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app }  from "../firebase";
import { useState, useEffect } from "react";
import Notification from "../components/Notifcation";
import { setNotification, hide } from "../redux/reducers/notificationReducer";
import { createNewPost } from "../redux/reducers/postsReducer";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import "react-quill/dist/quill.snow.css";
import "../styles/quill.css";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(state => state.theme);
  const loading = useSelector(state => state.posts.loading)
  let category = useSelector(state => state.category.categoryInput)
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    if (notification) {
      window.scrollTo(0, 0)
    }
  }, [notification])

  const handleUpload = async () => {
    dispatch(hide())
    setImageUploadLoading(true)
    try {
      if (!file) {
        dispatch(setNotification('please select an image', 'failure'))
        setImageUploadLoading(false)
        return
      }
      const storage = getStorage(app)
      const filename = new Date().getTime() + file.name
      const storageRef = ref(storage, filename)
      const uploadtask = uploadBytesResumable(storageRef, file)
      uploadtask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          dispatch(setNotification('could not upload image (must be less than 2 MB)', 'failure'))
          setFile(null)
          setImageUploadLoading(false)
          setImageUploadProgress(0)
        },
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
            setImageUploadLoading(false)
            setImageUploadProgress(0)
            setFormData({ ...formData, image: downloadURL })
          });
        }
      )
    } catch (error) {
      setImageUploadLoading(false)
      setImageUploadProgress(0)
      dispatch(setNotification('could not upload image', 'failure'))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (imageUploadLoading) {
      dispatch(setNotification('please wait for image to upload', 'failure'))
      return
    }

    if (Object.keys(formData).length === 0) {
      dispatch(setNotification('please fill in the form', 'failure'))
      return
    }

    if (category === '') {
      category = 'Uncategorised'
    }

    const result = await dispatch(createNewPost({ ...formData, category }))
    if (result.success) {
      navigate(`/post/${result.slug}`)
    }

  }

  return (
    <div className="p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <Notification />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput 
            type="text"
            placeholder="Title"
            required
            name="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <CategoryDropdown />
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput 
            type="file"
            accept="image/*"
            name="image"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button 
            type="button"
            outline
            className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
            size="sm"
            onClick={handleUpload}
            disabled={imageUploadLoading}
          >
           {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress ||0}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="post"
            className="w-full h-96 object-cover"
          />
        )}
        <ReactQuill 
          placeholder="Write something amazing..."
          theme="snow"
          className={`h-96 mb-12 ${theme === "dark" ? "quill-dark" : ""}`}
          modules={modules}
          formats={formats}
          required
          onChange={(content) => setFormData({ ...formData, content })}
        />
        <Button 
          type="submit"
          className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 mb-5"
          outline
          disabled={loading || imageUploadLoading}
        >
          {loading ? 'Loading...' : 'Publish'}
        </Button>
      </form>

    </div>
  )

}

export default CreatePost;