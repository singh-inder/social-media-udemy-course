import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const ContainerForToastr = ({ children }) => (
  <ToastContainer
    position="bottom-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover={false}
  >
    {children}
  </ToastContainer>
);

export const PostDeleteToastr = () => {
  return (
    <ContainerForToastr>
      {toast.info("Deleted Successfully", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })}
    </ContainerForToastr>
  );
};

export const ErrorToastr = ({ error }) => {
  return (
    <ContainerForToastr>
      {toast.error(error, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })}
    </ContainerForToastr>
  );
};

export const MsgSentToastr = () => (
  <ContainerForToastr>
    {toast.success("Sent successfully", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined
    })}
  </ContainerForToastr>
);
