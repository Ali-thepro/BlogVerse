import { Button, Spinner} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/reducers/postsReducer';
import Notification from '../components/Notifcation';
import CommentSection from '../components/CommentSection';


const PostPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.theme.theme);
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedpost = await dispatch(getPosts(`?slug=${postSlug}`));
      setPost(fetchedpost[0]);
    }
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getPosts());
    }
    fetchPosts();
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'> 
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <Notification />
      {post && (
        <>
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            {post.title}
          </h1>
          <Link
            to={`/search?category=${post.category}`}
            className='self-center mt-5'
          >
            <Button color='gray' pill size='md'>
              {post.category}
            </Button>
          </Link>
          <img
            src={post.image}
            alt={post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
          >
          </img>
          <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            
            <span className='italic'>
              {(post.content.length / 1000).toFixed(1)} min read
            </span>
          </div>
          <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <CommentSection post={post.id} />
        </>
      )}
    </main>
  )

}

export default PostPage;