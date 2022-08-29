import Button from "ui/button";
import withConfirmation from "ui/with-confirmation";

const SubmitButton = withConfirmation(Button);

const ConfirmationBox = ({ onSubmitForm }) => {
  return (
    <>
      <div className="mt-16 md:w-1/4 mx-auto">
        <div className="bg-gray-600 py-3 px-5 rounded-lg text-3xl">
          <div className="flex gap-4 items-center">
            <SubmitButton
              renderMessage={() => <p>Are you sure you want to proceed ?</p>}
              onConfirm={onSubmitForm}
              className="transition hover:rotate-12 hover:bg-red-500 p-3 bg-gray-300 rounded-lg"
            >
              Submit
            </SubmitButton>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmationBox;
