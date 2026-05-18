import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldData from "../assets/custom.geo.json"
import countryAttractions from "../assets/touristattractions.json"
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const Map = () => {
  const geoJsonLayerRef = useRef(null);

  const [visitedCountries, setVisitedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryImages, setCountryImages] = useState([]);

  useEffect(() => {
    const fetchVisitedCountries = async () => {
      const user = auth.currentUser;
      const userId = user.uid;
      if (!user) return;
      console.log("User Id ", user.uid);

      try {
        const userDocRef = doc(db, "images", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log(data);
          const visited = (data.images || []).map(img => {
            let country = img.country.replace(/^['"]+|['"]+$/g, '').trim();

            if (['England', 'Wales', 'Scotland'].includes(country)) {
              country = "United Kingdom";
            }
            return country;
          });
          const uniqueVisited = [...new Set(visited)];

          setVisitedCountries(uniqueVisited);
        }
        else {
          console.log("No locations found for user");
        }
      }
      catch (err) {
        console.error("Error fetching user locations: ", err);
      }
  };
  fetchVisitedCountries();
}, []);

  // Default style for all countries
  const defaultStyle = {
    color: "rgba(0, 255, 255)",
    weight: 1,
    fillOpacity: 0.2,
  };

  // Highlight style
  const highlightStyle = {
    color: "black",
    weight: 2,
    fillColor: "#cebf39ff",
    fillOpacity: 0.5,
  };

  const styleByVisited = (feature) => {
    const name = feature.properties.name;

    if (name && visitedCountries.some(v => v.toLowerCase() === name.toLowerCase())) {
      return highlightStyle
    }
    return defaultStyle
  }

  const handleCountryClick = async (feature) => {
    const countryName = feature.properties.name;
    setSelectedCountry(countryName);

    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, "images", user.uid));
      if (userDoc.exists()) {
        const allImages = userDoc.data().images || [];
        const filteredImages = allImages.filter(img => {
          let country = img.country;
          if (["England", "Scotland", "Wales"].includes(country)) country = "United Kingdom";
          return country === countryName;
        });
        setCountryImages(filteredImages);
      }
    } catch (err) {
      console.error("Error fetching images for country: ", err);
    }
  }

  const closeModal = () => {
    setSelectedCountry(null);
    setCountryImages([]);
  };

  // Function to highlight a country by name
  const highlightCountry = (countryName) => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer) => {
      const name =
        layer.feature.properties.ADMIN ||
        layer.feature.properties.name ||
        layer.feature.properties.NAME;

      // Reset to default first
      layer.setStyle(defaultStyle);

      // Apply highlight if it matches
      if (name && name.toLowerCase() === countryName.toLowerCase()) {
        layer.setStyle(highlightStyle);
        layer.bringToFront();
      }
    });
  };

  // Example: automatically highlight Nigeria after 2 seconds
//   useEffect(() => {
//     setTimeout(() => highlightCountry("Nigeria"), 2000);
//   }, []);

  return (
    <div
      className="flex justify-center"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        zIndex: 1, // make sure map is below the toggle button
        backgroundColor: "black",
      }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        style={{ height: "100%", width: "100%", backgroundColor: "#00ffff11" }}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        noWrap={true}
      >
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
          noWrap={true}
        /> */}
        <GeoJSON data={worldData} style={styleByVisited} ref={geoJsonLayerRef} onEachFeature={(feature, layer) => {
          layer.on({
            click: () => handleCountryClick(feature)
          });
        }}/>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
          noWrap={true}
        />
      </MapContainer>

      {selectedCountry && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "cadetblue",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          zIndex: 1000,
          overflowY: "auto",
        }}>
          <button 
            onClick={closeModal}
            style={{
              alignSelf: "flex-end",
              margin: "20px",
              padding: "10px 20px",
              cursor: "pointer",
              background: "#222",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}>Close</button>

            <h2 style={{ color: "white", marginBottom: "20px" }}>{selectedCountry}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {countryImages.map((img, i) => (
              <img
                key={i.imageUrl}
                src={img.imageUrl}
                alt={img.country}
                style={{ width: "150px", margin: "5px", borderRadius: "8px" }}
              />
            ))}
              {countryImages.length === 0 && <p style={{ color: "white" }}>No images for this country</p>}
            </div>
                  <div style={{ color: "white", marginLeft: "20px", minWidth: "200px" }}>
        <h3>Top Attractions:</h3>
        <ul>
          {countryAttractions[selectedCountry]?.map((attraction, index) => (
            <li key={index}>{attraction}</li>
          )) || <li>No attractions found</li>}
        </ul>
      </div>
          </div>
      )}
    </div>
  );
};

export default Map;