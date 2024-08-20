import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { likeComment, editComment, deleteComment } from '../redux/reducers/commentReducer';
import { Button, Textarea } from 'flowbite-react';
import { FaThumbsUp } from 'react-icons/fa';
import ReusableModal from './ReusableModal';

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);

  const handleLike = async () => {
    if (!user) {
      return navigate('/signin');
    }
    await dispatch(likeComment(comment.id));
  }

  const handleEdit = async () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  }

  const handleSave = async () => {
    setIsEditing(false);
    if (!user) {
      return navigate('/signin');
    }
    await dispatch(editComment(comment.id, { content: editedContent }));
  }

  const handleDelete = async () => {
    await dispatch(deleteComment(comment.id));
  }




  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={comment.user.profilePicture}
          alt={comment.user.username}
        />
      </div>
      <div className="flex-1">
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${comment.user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                outline
                className='focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                className='focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type='button'
                onClick={() => handleLike()}
                className={`text-gray-400 hover:text-blue-500 ${
                  user &&
                  comment.likes.includes(user.id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {user && (user.id === comment.user || user.isAdmin) && (
                <>
                  <button
                    type='button'
                    onClick={handleEdit}
                    className='text-gray-400 hover:text-blue-500'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowModal(true)}
                    className='text-gray-400 hover:text-red-500'
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete your comment? This action cannot be undone."
        confirmText="Yes, I'm sure"
        cancelText="No, Cancel"
      />
    </div>
  )
}

export default Comment;