import "./addUser.css";
import {
  arrayUnion,
  collection,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState, useRef } from "react";
import { getDocs } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);

  const {currentUser} = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }

      // Clear the input field after search
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        // Add key for document ID
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats : arrayUnion({
          chatId:newChatRef.id,
          lastMesssage: "",
          receiverId: currentUser.id,
          updatedAt : Date.now(),
        })

        
    })

    
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMesssage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      console.log(newChatRef.id);
    } catch (error) {
      console.error("Error adding chat:", error);
    }
  };

  return (
    <div>
      <div className="addUser">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            ref={inputRef}
            autoComplete="off"
          />
          <button>Search</button>
        </form>
        {user && (
          <div className="user">
            <div className="detail">
              <img src={user.avatar || "./avatar.png"} alt="" />
              <span>{user.username}</span>
            </div>
            <button onClick={handleAdd}>+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
