import { Table, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Notification from './Notifcation'
import ReusableModal from './ReusableModal'
import { getComments, deleteComment } from '../redux/reducers/commentReducer'
import { Link } from 'react-router-dom'

const DashComments = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const comments = useSelector((state) => state.comments.comments)
  const loading = useSelector((state) => state.comments.loading)
  const notification = useSelector((state) => state.notification)
  const [showModal, setShowModal] = useState(false)
  const [commentId, setCommentId] = useState(null)
  const [showMore, setShowMore] = useState(true)

  useEffect(() => {
    if (notification) {
      window.scrollTo(0, 0);
    }
  }, [notification]);

  useEffect(() => {
    const adminFetch = async () => {
      const fetchedComments = await dispatch(getComments());
      if (fetchedComments.length < 9) {
        setShowMore(false);
      }
    };
    const userFetch = async () => {
      const fetchedComments = await dispatch(getComments(`?userId=${user.id}`));
      if (fetchedComments.length < 9) {
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
    const startIndex = comments.length;
    let fetchedPosts;
    if (user.isAdmin) {
      fetchedPosts = await dispatch(
        getPosts(`?startIndex=${startIndex}`, true)
      );
    } else {
      fetchedPosts = await dispatch(
        getPosts(`?userId=${user.id}&startIndex=${startIndex}`, true)
      );
    }
    if (fetchedPosts.length < 9) {
      setShowMore(false);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    await dispatch(deleteComment(commentId));
  }


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {comments && comments.length > 0 && !loading ? (
        <>
          <Notification />
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of ikes</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              {user.isAdmin && (<Table.HeadCell>User</Table.HeadCell>)}
              <Table.HeadCell>Delete</Table.HeadCell>

            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={comment.id}
                  >
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${comment.post.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        <span>{comment.post.title}</span>
                      </Link>
                    </Table.Cell>
                    {user.isAdmin && (
                      <Table.Cell>
                        <Link
                          className="text-blue-500 hover:underline"
                          to={`/user/${comment.user.id}`}
                        >
                          {comment.user.username}
                        </Link>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentId(comment.id);
                        }}
                        className="font-medium text-red-500 cursor-pointer"
                      >
                        Delete
                      </span>
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
        title="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Yes, I'm sure"
        cancelText="No, Cancel"
      />
    </div>
  );


}

export default DashComments;