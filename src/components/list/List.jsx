import Chatlist from "./chatlist/Chatlist"
import Userinfo from "./userinfo/Userinfo"
import "./list.css"

const list = () => {
  return (
    <div className="list">
      <Userinfo/>
      <Chatlist/>

    </div>
  )
}

export default list
