import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar.jsx";
import Header from "./Header.jsx";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("No user logged in");
          setLoading(false);
          return;
        }

        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);

        let username = "Unknown";
        if (userSnap.exists()) {
          username = userSnap.data().username || "Unknown";
        }

        setUserData({
          username,
          email: user.email,
          createdAt: new Date(user.metadata.creationTime).toLocaleString(),
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "white", marginTop: "3rem" }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ textAlign: "center", color: "white", marginTop: "3rem" }}>
        <h3>No user data found. Please log in.</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#0f172a",
        color: "white",
        height: "100vh",
      }}
    >
      {/* Header anchored to the top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header />
      </div>
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "2rem",
          borderRadius: "10px",
          marginTop: "5rem",
          width: "300px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>👤 Profile</h2>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Joined:</strong> {userData.createdAt}</p>
      </div>
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0 }}>
        <Navbar />
      </div>
    </div>
  );
}

export default Profile;
