import "./userinfo.css";
import { useUserStore } from "../../../lib/userStore";

const Userinfo = () => {

  const {currentUser} = useUserStore();
  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h5>{currentUser.username}</h5>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" className="icon" />
        <img src="./video.png" alt="" className="icon" />
        <img src="./edit.png" alt=""  className="icon"/>
      </div>
    </div>
  )
}

export default Userinfo
