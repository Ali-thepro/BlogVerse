import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../redux/reducers/postsReducer";
import PostCard from "../components/PostCard";
import { Spinner } from "flowbite-react";
import Notification from "../components/Notification";

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getPosts("?limit=9"));
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Blog Verse
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">
          Here, you can create your own blog and connect with other users -
          whether you're writing or just reading, there's a space for everyone!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
        {user && (
          <Link
            to="/create-post"
            className="text-xs sm:text-sm text-red-500 font-bold hover:underline"
          >
            Create a new post
          </Link>
        )}
      </div>
      <div className="max-w-screen-2xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && !loading ? (
          <>
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap justify-center gap-4'>
              {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
          </>
        ) : (
          <div className="">
            <Notification />
            <p className="text-center text-2xl font-semibold text-gray-800 dark:text-white pt-5">
              {loading ? <Spinner size="xl" /> : "No posts found"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
