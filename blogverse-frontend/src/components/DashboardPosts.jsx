import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./Notification";
import { getPosts, deletePost } from "../redux/reducers/postsReducer";
import { Link } from "react-router-dom";
import { Table, Spinner } from "flowbite-react";
import ReusableModal from "./ReusableModal";

const DashboardPosts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const notification = useSelector((state) => state.notification);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    if (notification) {
      window.scrollTo(0, 0);
    }
  }, [notification]);

  useEffect(() => {
    const adminFetch = async () => {
      const fetchedPosts = await dispatch(getPosts());
      if (fetchedPosts.length < 9) {
        setShowMore(false);
      }
    };
    const userFetch = async () => {
      const fetchedPosts = await dispatch(getPosts(`?userId=${user.id}`));
      if (fetchedPosts && fetchedPosts.length < 9) {
        setShowMore(false);
      }
    };
    if (user.isAdmin) {
      adminFetch();
    } else {
      userFetch();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    let fetchedPosts;
    if (user.isAdmin) {
      fetchedPosts = await dispatch(getPosts(`?startIndex=${startIndex}`, true));
    } else {
      fetchedPosts = await dispatch(getPosts(`?userId=${user.id}&startIndex=${startIndex}`, true));
    }
    if (fetchedPosts.length < 9) {
      setShowMore(false);
    }
  };

  const handleDelete = () => {
    setShowModal(false);
    dispatch(deletePost(postId, user.id));
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {posts && posts.length > 0 && !loading ? (
        <>
          <Notification />
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              {user.isAdmin && <Table.HeadCell>User</Table.HeadCell>}
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts.map((post) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={post.id}
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    {user.isAdmin && (
                      <Table.Cell>
                        <Link
                          className="text-blue-500 hover:underline"
                          to={`/search?userId=${post.user.id}`}
                        >
                          {post.user.username}
                        </Link>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-blue-500 hover:underline"
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.numberOfLikes}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/search?category=${post.category}`}
                      >
                        {post.category}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostId(post.id);
                        }}
                        className="font-medium text-red-500 cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="">
          <Notification />
          <p className="text-center text-2xl font-semibold text-gray-800 dark:text-white pt-5">
            {loading ? <Spinner size="xl" /> : "No posts found"}
          </p>
        </div>
      )}
      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Yes, I'm sure"
        cancelText="No, Cancel"
      />
    </div>
  );
};

export default DashboardPosts;
