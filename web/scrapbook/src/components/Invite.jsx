import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "./Navbar.jsx";

function Invite() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;

  // 🧠 Load all users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // 🔍 Filter users by username (substring, case-insensitive)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const matches = allUsers.filter(
      (u) =>
        u.username &&
        u.username.toLowerCase().includes(lower) &&
        u.id !== currentUser?.uid // exclude self
    );

    setFilteredUsers(matches);
  }, [searchTerm, allUsers, currentUser]);

  // 📨 Send friend invitation (update friends db)
  async function handleInvite(targetUser) {
    if (!currentUser) return alert("You must be logged in to send invites.");

    const senderRef = doc(db, "friends", currentUser.uid);
    const receiverRef = doc(db, "friends", targetUser.id);

    try {
      // Make sure both users have friend docs
      const [senderSnap, receiverSnap] = await Promise.all([
        getDoc(senderRef),
        getDoc(receiverRef),
      ]);

      if (!senderSnap.exists()) {
        await setDoc(senderRef, {
          invitations_sent: [],
          invitations_received: [],
          friends: [],
        });
      }

      if (!receiverSnap.exists()) {
        await setDoc(receiverRef, {
          invitations_sent: [],
          invitations_received: [],
          friends: [],
        });
      }

      // Update both
      await Promise.all([
        updateDoc(senderRef, {
          invitations_sent: arrayUnion(targetUser.id),
        }),
        updateDoc(receiverRef, {
          invitations_received: arrayUnion(currentUser.uid),
        }),
      ]);

      alert(`✅ Invitation sent to ${targetUser.username}`);
    } catch (err) {
      console.error("Error sending invitation:", err);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        paddingBottom: "3rem",
      }}
    >
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ marginTop: "1rem" }}>🔍 Search Friends</h2>

        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginTop: "1rem",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            width: "280px",
            outline: "none",
          }}
        />

        {loading && <p style={{ color: "#94a3b8" }}>Loading users...</p>}

        {filteredUsers.length > 0 && (
          <div style={{ width: "90%", maxWidth: "600px", marginTop: "2rem" }}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "#1e293b",
                  marginBottom: "1rem",
                  borderRadius: "10px",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p><strong>{user.username}</strong></p>
                <button
                  onClick={() => handleInvite(user)}
                  style={{
                    background: "#22c55e",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Invite;
