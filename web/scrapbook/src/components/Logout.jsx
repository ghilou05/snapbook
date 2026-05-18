import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      try {
        await signOut(auth);
        console.log("User signed out");
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }

    handleLogout();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        flexDirection: "column",
      }}
    >
      <h2>Logging out...</h2>
      <p>You will be redirected shortly.</p>
    </div>
  );
}

export default Logout;
