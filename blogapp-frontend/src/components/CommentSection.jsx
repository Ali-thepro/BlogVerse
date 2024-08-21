import { Button, Textarea } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./Notification";
import {
  createComment,
  getPostComments,
} from "../redux/reducers/commentsReducer";
import Comment from "./Comment";

const CommentSection = ({ post }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const totalComments = useSelector((state) => state.comments.totalComments);
  const user = useSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");
  const [showMore, setShowMore] = useState(true);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (comment.length === 0 || comment.length > 200) {
      return;
    }
    await dispatch(createComment({ comment, post: post.id, user: user.id }));
    const fetchedComments = await dispatch(
      getPostComments(post.id, "?limit=-1")
    );
    if (fetchedComments.length < 5) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
    setComment("");
  };

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await dispatch(
        getPostComments(post.id, "?limit=-1")
      );
      if (fetchedComments.length < 5) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    };
    fetchComments();
  }, [post]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    const fetchedComments = await dispatch(
      getPostComments(post.id, `?startIndex=${startIndex}`, true)
    );
    if (fetchedComments.length < 5) {
      setShowMore(false);
    }
  };

  const handleDeleteComment = () => {
    dispatch(getPostComments(post.id, "?limit=-1"));
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {user ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p className="mr-1">Signed in as:</p>
          <img
            src={user.profilePicture}
            alt={user.username}
            className="h-8 w-8 object-cover rounded-full mr-1"
          ></img>
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-blue-500 hover:underline"
          >
            @{user.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/signin"}>
            Sign In
          </Link>
        </div>
      )}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button
              className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
              outline
              type="submit"
            >
              Submit
            </Button>
          </div>
          <Notification />
        </form>
      )}
      {comments && comments.length > 0 ? (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{totalComments}</p>
            </div>
          </div>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={comment}
                handleDeleteComment={handleDeleteComment}
                post={post}
              />
            );
          })}
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
        <p className="text-sm my-5">No comments yet!</p>
      )}
    </div>
  );
};

export default CommentSection;
