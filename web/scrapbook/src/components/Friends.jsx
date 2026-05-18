import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
  getDocs,
  collection,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "./Navbar.jsx";

function Friends() {
  const [friends, setFriends] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // 🧠 Fetch all users for username lookups
  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchAllUsers();
  }, []);

  // 🧠 Load user's friends + invitations
  useEffect(() => {
    async function fetchFriends() {
      if (!currentUser) return;

      const ref = doc(db, "friends", currentUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          invitations_sent: [],
          invitations_received: [],
          friends: [],
        });
        setFriends([]);
        setReceivedInvites([]);
      } else {
        const data = snap.data();
        setFriends(data.friends || []);
        setReceivedInvites(data.invitations_received || []);
      }

      setLoading(false);
    }

    fetchFriends();
  }, [currentUser]);

  // 🧩 Helper — get username from UID
  function getUsername(uid) {
    const user = allUsers.find(u => u.id === uid);
    return user?.username || user?.displayName ||"Unknown User";
  }

  // ❌ Remove friend (from both users)
  async function handleRemove(friendId) {
    try {
      const userRef = doc(db, "friends", currentUser.uid);
      const friendRef = doc(db, "friends", friendId);

      await Promise.all([
        updateDoc(userRef, { friends: arrayRemove(friendId) }),
        updateDoc(friendRef, { friends: arrayRemove(currentUser.uid) }),
      ]);

      setFriends((prev) => prev.filter((id) => id !== friendId));
      alert("Friend removed.");
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  }

  // ✅ Accept invitation
  async function handleAccept(inviterId) {
    try {
      const userRef = doc(db, "friends", currentUser.uid);
      const inviterRef = doc(db, "friends", inviterId);

      const [userSnap, inviterSnap] = await Promise.all([
        getDoc(userRef),
        getDoc(inviterRef),
      ]);

      if (!userSnap.exists()) {
        await setDoc(userRef, { friends: [], invitations_sent: [], invitations_received: [] });
      }
      if (!inviterSnap.exists()) {
        await setDoc(inviterRef, { friends: [], invitations_sent: [], invitations_received: [] });
      }

      await Promise.all([
        updateDoc(userRef, {
          friends: arrayUnion(inviterId),
          invitations_received: arrayRemove(inviterId),
        }),
        updateDoc(inviterRef, {
          friends: arrayUnion(currentUser.uid),
          invitations_sent: arrayRemove(currentUser.uid),
        }),
      ]);

      setFriends((prev) => [...prev, inviterId]);
      setReceivedInvites((prev) => prev.filter((id) => id !== inviterId));
      alert(`✅ You are now friends with ${getUsername(inviterId)}!`);
    } catch (err) {
      console.error("Error accepting invitation:", err);
    }
  }

  // 🚫 Reject invitation
  async function handleReject(inviterId) {
    try {
      const userRef = doc(db, "friends", currentUser.uid);
      const inviterRef = doc(db, "friends", inviterId);

      await Promise.all([
        updateDoc(userRef, {
          invitations_received: arrayRemove(inviterId),
        }),
        updateDoc(inviterRef, {
          invitations_sent: arrayRemove(currentUser.uid),
        }),
      ]);

      setReceivedInvites((prev) => prev.filter((id) => id !== inviterId));
      alert(`❌ Rejected invitation from ${getUsername(inviterId)}.`);
    } catch (err) {
      console.error("Error rejecting invitation:", err);
    }
  }

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "3rem" }}>
        Loading...
      </div>
    );
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
        <h2 style={{ marginTop: "1rem" }}>👥 Your Friends</h2>

        {/* Friends Section */}
        {friends.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: "1rem" }}>No friends yet.</p>
        ) : (
          <div style={{ marginTop: "1rem", width: "90%", maxWidth: "600px" }}>
            {friends.map((id) => (
              <div
                key={id}
                style={{
                  background: "#1e293b",
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{getUsername(id)}</span>
                <button
                  onClick={() => handleRemove(id)}
                  style={{
                    background: "#ef4444",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Invitations Section */}
        <h3 style={{ marginTop: "2rem" }}>📨 Invitations Received</h3>

        {receivedInvites.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: "1rem" }}>No pending invites.</p>
        ) : (
          <div style={{ marginTop: "1rem", width: "90%", maxWidth: "600px" }}>
            {receivedInvites.map((id) => (
              <div
                key={id}
                style={{
                  background: "#1e293b",
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{getUsername(id)}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleAccept(id)}
                    style={{
                      background: "#22c55e",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(id)}
                    style={{
                      background: "#ef4444",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;
