import { Button, Spinner} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, likePost } from '../redux/reducers/postsReducer';
import Notification from '../components/Notification';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { FaHeart } from 'react-icons/fa';


const PostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.theme.theme);
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await dispatch(getPosts(`?slug=${postSlug}`));
      setPost(fetchedPosts[0]);
      dispatch(getPosts('?limit=3'));
    };
    fetchData();
  }, [postSlug]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'> 
        <Spinner size="xl" />
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (post) {
      await dispatch(likePost(post.id));
      const fetchedPosts = await dispatch(getPosts(`?slug=${postSlug}`));
      setPost(fetchedPosts[0]);
    }
  };

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <Notification />
      {post && (
        <>
          <div className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            <h1>{post.title}</h1>
            {post.user ? (
              <Link to={`/search?userId=${post.user.id}`} className="text-blue-500 hover:underline text-sm">
                By {post.user.username}
              </Link>
            ) : (
              <p className="text-gray-400 text-sm">Anonymous author</p>
            )}
          </div>
          <div className="flex justify-center items-center gap-5 mt-5">
            <Link
              to={`/search?category=${post.category}`}
              className='text-gray-400'
            >
              <Button color='gray' pill size='md'>
                {post.category}
              </Button>
            </Link>
            <button
              onClick={() => handleLike()}
              className={`text-gray-400 hover:text-red-500 ${
                user && post.likes.includes(user.id) && "!text-red-500"
              }`}
            >
              <FaHeart size='32' />
            </button>
            <p className="text-gray-400 ">
              {post.numberOfLikes > 0 && post.numberOfLikes + " " + (post.numberOfLikes === 1 ? "like" : "likes")}
            </p>
          </div>
          <img
            src={post.image}
            alt={post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
          >
          </img>
          <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
            <span> Updated on {new Date(post.updatedAt).toLocaleDateString()}</span>
            <span className='italic'>
              {(post.content.length / 1000).toFixed(1)} min read
            </span>
          </div>
          <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <div className="flex justify-between items-center p-3 max-w-2xl mx-auto w-full">

          </div>
          <CommentSection post={post} />
          <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recent articles</h1>
            <div className='flex flex-wrap gap-5 mt-5 justify-center'>
              {posts &&
                posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </div>
        </>
      )}
    </main>
  )

}

export default PostPage;