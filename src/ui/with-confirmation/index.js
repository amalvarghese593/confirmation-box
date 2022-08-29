import { useState } from "react";
import Modal from "ui/modal";
import Button from "ui/button";

export default function withConfirmation(Component) {
  return function WrappedComponent({
    renderMessage = () => {},
    onConfirm = () => {},
    ...rest
  }) {
    const [showModal, setShowModal] = useState(false);

    return (
      <div>
        <Component {...rest} onClick={() => setShowModal(true)} />

        <Modal open={showModal} close={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>{renderMessage()}</div>
            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                  setShowModal(false);
                }}
                className="bg-blue-500 font-medium text-white drop-shadow py-2 px-8 rounded-lg shadow-sm"
              >
                Yes
              </Button>
              <div onClick={() => setShowModal(false)}>No!</div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };
}
