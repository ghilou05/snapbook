import { useState } from "react";
import Map from './Map.jsx';
import Globe3D from './Globe3D.jsx';
import Navbar from './Navbar.jsx';
import Globe from 'react-globe.gl';
import TakePhoto from "./TakePhoto.jsx";
import { auth } from "../firebase";
import Header from "./Header.jsx"


function Home(){
  
  const [viewMode, setViewMode] = useState("3D");

  const toggleView = () => {
    setViewMode(viewMode === "3D" ? "2D" : "3D");
  }
  return (
    
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative", // important for absolute positioning
      }}
    >
      <Header />

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {viewMode === "3D" ? <Globe3D /> : <Map />}

        {/* Toggle button always on top */}
        <button
          onClick={toggleView}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000, // increase z-index
            padding: "8px 12px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {viewMode === "3D" ? "Show 2D Map" : "Show 3D Globe"}
        </button>
      </div>

        <Navbar />
      {/* Fixed navbar anchored to bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 30,
        }}
      />
    </div>
    )
}

export default Home;
