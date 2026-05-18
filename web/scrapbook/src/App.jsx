import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Signup from "./components/Signup.jsx";
import Logout from "./components/Logout.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import { Routes, Route } from "react-router-dom";
import TakePhoto from "./components/TakePhoto.jsx";
import Profile from "./components/Profile.jsx";
import Invite from "./components/Invite.jsx"
import Friends from "./components/Friends.jsx";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/photo" element={<TakePhoto />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
