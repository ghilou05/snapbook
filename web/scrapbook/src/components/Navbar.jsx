import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const [hovered, setHovered] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#03091d",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.2s, transform 0.2s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#00ffff33",
    transform: "scale(1.05)",
  };

  const activeStyle = {
    backgroundColor: "#00ffff55",
    transform: "scale(1.05)",
  };

  // 👇 Build routes dynamically
  const routes = user
    ? [
        { label: "Home", path: "/" },
        { label: "Upload", path: "/photo" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", path: "/logout" },
        { label: "Invite", path: "/invite"},
        { label: "Friends", path: "/friends"}
      ]
    : [
        { label: "Login", path: "/login" },
        { label: "Signup", path: "/signup" },
      ];

  return (
      <div
          style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center', // center the buttons horizontally
              width: '100%',
              backgroundColor: '#111827', // navbar background
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              // padding: '1rem 1rem 1rem 1rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              marginTop: '0'
          }}
    >
      {routes.map((route, idx) => (
        <NavLink
          key={route.label}
          to={route.path}
          style={({ isActive }) => ({
            ...buttonStyle,
            ...(hovered === idx ? buttonHoverStyle : {}),
            ...(isActive ? activeStyle : {}),
          })}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          {route.label}
        </NavLink>
      ))}
    </div>
  );
}

export default Navbar;
