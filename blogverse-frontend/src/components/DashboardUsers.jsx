import { Table, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUsers } from "../redux/reducers/usersReducer";
import { deleteUsers } from "../redux/reducers/usersReducer";
import { Link } from "react-router-dom";
import Notification from "./Notification";
import ReusableModal from "./ReusableModal";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashboardUsers = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const notification = useSelector((state) => state.notification);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (notification) {
      window.scrollTo(0, 0);
    }
  }, [notification]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await dispatch(getUsers());
      if (fetchedUsers && fetchedUsers.length < 9) {
        setShowMore(false);
      }
    };
    fetchUsers();
  }, []);

  const handleShowMore = async () => {
    const startIndex = users.length;
    const fetchedUsers = await dispatch(getUsers(`?startIndex=${startIndex}`, true));
    if (fetchedUsers && fetchedUsers.length < 9) {
      setShowMore(false);
    }
  };  

  const handleDelete = () => {
    setShowModal(false);
    dispatch(deleteUsers(userId, user.isAdmin));
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {users && users.length > 0 && !loading ? (
        <>
          <Notification />
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={user.id}
                  >
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-blue-500 hover:underline"
                        to={`/search?userId=${user.id}`}
                      >
                        {user.username}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserId(user.id);
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
            {loading ? <Spinner size="xl" /> : "No users found"}
          </p>
        </div>
      )}
      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete your account? This action cannot be undone."
        confirmText={"Yes, I'm sure"}
        cancelText={"No, Cancel"}
      />
    </div>
  );
};

export default DashboardUsers;
