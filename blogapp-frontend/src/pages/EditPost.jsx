import { TextInput, FileInput, Button } from "flowbite-react";
import ReactQuill from "react-quill";
import { modules, formats } from "../utils/quill";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CategoryDropdown from "../components/CategoryDropdown";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { setNotification, hide } from "../redux/reducers/notificationReducer";
import { setCategoryInput } from "../redux/reducers/categoryReducer";
import { editPost, getPosts } from "../redux/reducers/postsReducer";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import "react-quill/dist/quill.snow.css";
import "../styles/quill.css";

const EditPost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(state => state.theme);
  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.posts.loading);
  let category = useSelector(state => state.category.categoryInput);
  const notification = useSelector(state => state.notification);
  const { postId } = useParams();

  useEffect(() => {
    if (notification) {
      window.scrollTo(0, 0);
    }
  }, [notification]);

  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getPosts(`?postId=${postId}`));
    };
    fetchPosts();
  }, [postId]);
  
  useEffect(() => {
    if (posts && posts.length > 0) {
      dispatch(setCategoryInput(posts[0].category));
    }
    return () => {
      dispatch(setCategoryInput(''));
    };
  }, [posts, dispatch]);

  const handleUpload = async () => {
    dispatch(hide());
    setImageUploadLoading(true);
    try {
      if (!file) {
        dispatch(setNotification('please select an image', 'failure'));
        setImageUploadLoading(false);
        return;
      }
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadtask = uploadBytesResumable(storageRef, file);
      uploadtask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          dispatch(setNotification('could not upload image (must be less than 2 MB)', 'failure'));
          setFile(null);
          setImageUploadLoading(false);
          setImageUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
            setImageUploadLoading(false);
            setImageUploadProgress(0);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadLoading(false);
      setImageUploadProgress(0);
      dispatch(setNotification('could not upload image', 'failure'));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageUploadLoading) {
      dispatch(setNotification('please wait for image to upload', 'failure'));
      return;
    }
    if (category === '') {
      category = 'Uncategorised';
    }
    if (Object.keys(formData).length === 0 && category === posts[0].category) {
      dispatch(setNotification('No changes made', 'failure'));
      return;
    }

    const result = await dispatch(editPost(postId, { ...formData, category }));
    if (result.success) {
      navigate(`/post/${result.slug}`);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto min-h-screen">
      {posts && posts.length > 0 ? (
        <>
          <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
          <p className="text-center text-sm text-red-500 my-7 font-semibold">If the desired category is not available in the dropdown, you may create a new one.</p>
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
                value={formData.title || posts[0].title}
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
                      value={imageUploadProgress || 0}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  'Upload Image'
                )}
              </Button>
            </div>
            {(formData.image || posts[0].image) && (
              <img
                src={formData.image || posts[0].image}
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
              value={formData.content || posts[0].content}
            />
            <Button
              type="submit"
              className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 mb-5"
              outline
              disabled={loading || imageUploadLoading}
            >
              {loading ? 'Loading...' : 'Update Post'}
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center text-3xl my-7 font-semibold">Loading</div>
      )}
    </div>
  );
};

export default EditPost;