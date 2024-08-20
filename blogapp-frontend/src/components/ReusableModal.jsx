import { Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ReusableModal = ({ show, onClose, onConfirm, title, confirmText, cancelText }) => {
  const theme = useSelector(state => state.theme);
  return (
    <Modal 
      show={show}
      onClose={onClose}
      popup
      size='md'
      className={theme === 'dark' ? 'dark' : ''}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="text-red-500 text-5xl mb-4 mx-auto h-14 w-14"/>
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="flex justify-center gap-4">
            <Button 
              color="failure"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
            <Button 
              color="gray"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReusableModal;