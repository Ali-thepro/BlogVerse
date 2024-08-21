import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiAnnotation, HiDocumentText, HiOutlineUserGroup, HiArrowNarrowUp, HiArrowNarrowDown } from "react-icons/hi";
import { getPosts } from "../redux/reducers/postsReducer";
import { getUsers } from "../redux/reducers/usersReducer";
import { getComments } from "../redux/reducers/commentsReducer";

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const totalPosts = useSelector((state) => state.posts.totalPosts);
  const lastMonthPosts = useSelector((state) => state.posts.lastMonthPosts);
  const loading = useSelector((state) => state.posts.loading);
  const users = useSelector((state) => state.users.users);
  const totalUsers = useSelector((state) => state.users.totalUsers);
  const lastMonthUsers = useSelector((state) => state.users.lastMonthUsers);
  const comments = useSelector((state) => state.comments.comments);
  const totalComments = useSelector((state) => state.comments.totalComments);
  const lastMonthComments = useSelector(
    (state) => state.comments.lastMonthComments
  );

  useEffect(() => {
    if (user.isAdmin) {
      dispatch(getPosts('?limit=5'));
      dispatch(getUsers('?limit=5'));
      dispatch(getComments('?limit=5'));
    }
  }, [user]);

  return (
    <div className='p-3 md:mx-auto'>
      {!loading ? (
        <>
          <div className='flex-wrap flex gap-4 justify-center'>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                  <p className='text-2xl'>{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex gap-2 text-sm'>
                {lastMonthUsers === 0 ? (
                  <span className='text-red-500 flex items-center'>
                    <HiArrowNarrowDown />
                    {lastMonthUsers}
                  </span>
                ) : (
                  <span className='text-green-500 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthUsers}
                  </span>
                )}
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>
                    Total Comments
                  </h3>
                  <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex gap-2 text-sm'>
                {lastMonthComments === 0 ? (
                  <span className='text-red-500 flex items-center'>
                    <HiArrowNarrowDown />
                    {lastMonthComments}
                  </span>
                ) : (
                  <span className='text-green-500 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthComments}
                  </span>
                )}
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                  <p className='text-2xl'>{totalPosts}</p>
                </div>
                <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex gap-2 text-sm'>
                {lastMonthPosts === 0 ? (
                  <span className='text-red-500 flex items-center'>
                    <HiArrowNarrowDown />
                    {lastMonthPosts}
                  </span>
                ) : (
                  <span className='text-green-500 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthPosts}
                  </span>
                )}
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent users</h1>
                <Button outline className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
                  <Link to={'/dashboard?tab=users'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>User image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                {users && 
                  users.map((user) => ( // no need to have a return statement here
                      <Table.Row key={user.id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt='user'
                            className='w-10 h-10 rounded-full bg-gray-500'
                          />
                        </Table.Cell>
                        <Table.Cell>
                        <Link
                          to={`/search?userId=${user.id}`}
                          className='text-blue-500 hover:underline'
                        >
                          {user.username}
                        </Link>
                        </Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent comments</h1>
                <Button outline className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
                  <Link to={'/dashboard?tab=comments'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Comment content</Table.HeadCell>
                  <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                {comments &&
                  comments.map((comment) => (
                      <Table.Row key={comment.id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell className='w-96'>
                            <p className='line-clamp-2'>{comment.content}</p>
                        </Table.Cell>
                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent posts</h1>
                <Button outline className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
                  <Link to={'/dashboard?tab=posts'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Post image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                </Table.Head>
                <Table.Body  className='divide-y'>
                {posts &&
                  posts.map((post) => (
                      <Table.Row key={post.id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>
                          <Link
                            to={`/post/${post.slug}`}
                            className='text-blue-500 hover:underline'
                          >
                            <img
                              src={post.image}
                              alt='user'
                              className='w-14 h-10 rounded-md bg-gray-500'
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell className='w-96'>
                        <Link
                          to={`/post/${post.slug}`}
                          className='text-blue-500 hover:underline'
                        >
                          {post.slug}
                        </Link>
                        </Table.Cell>
                        <Table.Cell className='w-5'>{post.category}</Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <div className="">
          <p className="text-center text-2xl font-semibold text-gray-800 dark:text-white pt-5">
            {loading ? <Spinner size="xl" /> : "No posts found"}
          </p>
        </div>
      )}

    </div>
  );

};

export default DashboardOverview;
