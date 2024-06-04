import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const isUsernameTaken = async (username) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

 const handleRegister = async (e) => {
   e.preventDefault();
   setLoading(true);
   const formData = new FormData(e.target);
   const username = formData.get("username");
   const email = formData.get("email");
   const password = formData.get("password");

   if (!username || !email || !password) {
     toast.error("All fields are required");
     setLoading(false);
     return;
   }

   try {
     if (await isUsernameTaken(username)) {
       toast.error("Username is already taken");
       setLoading(false);
       return;
     }

     const res = await createUserWithEmailAndPassword(auth, email, password);
     let imgUrl = "";

     if (avatar.file) {
       try {
         imgUrl = await upload(avatar.file);
       } catch (uploadError) {
         console.error("Image upload error:", uploadError);
         toast.error("Failed to upload avatar");
         setLoading(false);
         return;
       }
     }

     await setDoc(doc(db, "users", res.user.uid), {
       username,
       email,
       avatar: imgUrl,
       id: res.user.uid,
       blocked: [],
     });

     await setDoc(doc(db, "userchats", res.user.uid), {
       chats: [],
     });

     toast.success("User created successfully");
   } catch (err) {
     console.error("Registration error:", err);
     toast.error(err.message);
   } finally {
     setLoading(false);
   }
 };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      // Optional: Redirect user after login
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="login">
      <div className="web-name">
        <h1><span>Chat</span>Buddy</h1>
        <img src="./favicon2-02.png" alt="" />
        </div>
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" autoComplete="off" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="Upload Avatar" />
            <p> Upload Profile</p>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" autoComplete="off" />
          <input type="email" placeholder="Email" name="email" autoComplete="off" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
