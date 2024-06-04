import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={2000} limit={1} />
    </div>
  );
};

export default Notification;
