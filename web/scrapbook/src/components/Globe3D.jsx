import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3-geo";
import countriesDataFile from "../assets/countries.geo.json";
import countryAttractions from "../assets/touristattractions.json";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Globe3D() {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const friendGlobeRef = useRef(null);

  const [countries, setCountries] = useState({ features: [] });
  const [labels, setLabels] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryImages, setCountryImages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendCountries, setFriendCountries] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendUsernames, setFriendUsernames] = useState({});
  const [friendCountryImages, setFriendCountryImages] = useState([]);
  const [friendSelectedCountry, setFriendSelectedCountry] = useState(null);

  const closeModal = () => setSelectedCountry(null);


  if (typeof window !== "undefined") {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/login")) {
          window.location.replace("/login");
        }
      }
    });
  }


  useEffect(() => {
    initData(countriesDataFile);
  }, []);

  const initData = (data) => {
    setCountries(data);

    const countryLabels = data.features.map((feature) => {
      const [lng, lat] = d3.geoCentroid(feature);
      return { lat, lng, name: feature.properties.name };
    });

    setLabels(countryLabels);
  };

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


// Fetch friend usernames

  // Fetch friends list
  useEffect(() => {
    async function fetchFriends() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "friends", user.uid);
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
        console.log(data.friends);
        setFriends(data.friends || []);
        const friendIds = data.friends || [];
        const usernames = {};

        for (const uid of friendIds) {
          try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              usernames[uid] = userDoc.data().username || uid;
            } else {
              usernames[uid] = uid;
            } 
            console.log("fetched usernameS: ", usernames);
          } catch (err) {
            console.error(`Error fetching username for ${uid}:`, err);
            usernames[uid]= uid;
          }
        }
        setFriendUsernames(usernames);


        // setReceivedInvites(data.invitations_received || []);
      }

      // setLoading(false);
    }

    fetchFriends();
  }, [auth.currentUser]);

  // Fetch friends visited countries
  const fetchFriendCountries = async (friendUid) => {
    if (friendCountries[friendUid]) return; // already fetched
    if (!friendUid) return;

    try {
      const docSnap = await getDoc(doc(db, "images", friendUid));
      if (docSnap.exists()) {
        let imagesData = docSnap.data().images;

        if (!Array.isArray(imagesData)) imagesData = [imagesData];

        const visited = imagesData.map(img => {
          let country = img.country.replace(/^['"]+|['"]+$/g, "").trim();
          if (["England", "Scotland", "Wales"].includes(country)) country = "United Kingdom";
          return country;        
        })

        setFriendCountries((prev) => ({ ...prev, [friendUid]: [...new Set(visited)] }));
      }
    } catch (err) {
      console.error("Error fetching friend's countries:", err);
    }
  };


  // Measure container and update size
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      });
    };

    updateSize();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateSize());
      ro.observe(containerRef.current);
    } else {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updateSize);
    };
  }, [containerRef.current]);

  const handlePolygonClick = async (feature) => {
    const countryName = feature.properties.name;
    setSelectedCountry(countryName);
    setFriendSelectedCountry(null);
    setFriendCountryImages([])
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "images", user.uid));
      if (userDoc.exists()) {
        const allImages = userDoc.data().images || [];
        const filteredImages = allImages.filter((img) => {
          let country = img.country;
          if (["England", "Scotland", "Wales"].includes(country)) country = "United Kingdom";
          return country === countryName;
        });
        setCountryImages(filteredImages);
      }
    }
    catch (err) {
      console.error("Error fetching images for country: ", err);
    }
  }

  const closeFriendModal = () => setFriendSelectedCountry(null);

  const handleFriendPolygonClick = async (feature) => {
    const countryName = feature.properties.name;
    setFriendSelectedCountry(countryName);
    setSelectedCountry(null);
    setCountryImages([]);
    try {
      const docSnap = await getDoc(doc(db, "images", selectedFriend));
      console.log("fwef",docSnap);
      if (docSnap.exists()) {
        const allImages = docSnap.data().images || [];
        const filteredImages = allImages.filter((img) => {
          let country = img.country;
          if (["England", "Scotland", "Wales"].includes(country)) country = "United Kingdom";
          return country === countryName;
        });
        setFriendCountryImages(filteredImages);
      }
    } catch (err) {
      console.error("Error fetching friend's images: ", err);
    }
  };

  const createHtmlLabel = (d) => {
    const el = document.createElement("div");
    el.textContent = d.name;
    el.style.color = "white";
    el.style.fontSize = "10px";
    el.style.pointerEvents = "none";
    return el;
  }

  return (

    <div
      ref={containerRef}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }}>
        {friends.map((friend) => (
          <label key={friend} style={{ display: "block", color: "white", marginBottom: "5px" }}>
            <input
              type="checkbox"
              name="selectedFriend"
              checked={selectedFriend === friend}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedFriend(friend);
                  fetchFriendCountries(friend);
                }
                else {
                  setSelectedFriend(null);
                }
              }}
            />
            {friendUsernames[friend] || friend}
          </label>
        ))}
      </div>
      {size.width > 0 && size.height > 0 && (
        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Globe
            ref={globeRef}
            width={selectedFriend ? size.width / 2 - 10 : size.width}
            height={size.height}
            globeRadius={Math.min(size.width, size.height) * 0.18}
            polygonsData={countries.features}
            polygonCapColor={(feature) =>
              visitedCountries.includes(feature.properties.name) ? "#cebf39ff" : "#003333fd"
            }
            onPolygonClick={handlePolygonClick}
            polygonStrokeColor={() => "#00ffff"}
            htmlElementsData={labels}
            htmlElement={createHtmlLabel}
            backgroundColor="black"
          />
          {selectedFriend && (
          <Globe
            ref={friendGlobeRef}
            width={size.width / 2 - 10}
            height={size.height}
            globeRadius={Math.min(size.width, size.height) * 0.18}
            polygonsData={countries.features}
            polygonCapColor={(feature) =>
              friendCountries[selectedFriend]?.includes(feature.properties.name)
                ? "blue"
                : "#003333fd"
            }
            onPolygonClick={handleFriendPolygonClick}
            polygonStrokeColor={() => "#00ffff"}
            htmlElementsData={labels}
            htmlElement={createHtmlLabel}
            backgroundColor="black"
          />
        )}
      </div>
      )}      
      {selectedCountry && (
        <div className="image-overlay" style={{
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
          }}>
            Close
        </button>
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
      {friendSelectedCountry && (
        <div className="image-overlay" style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "darkslateblue",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          zIndex: 1000,
          overflowY: "auto",
        }}>
        <button 
          onClick={closeFriendModal}
          style={{
            alignSelf: "flex-end",
            margin: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            background: "#222",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}>
            Close
        </button>
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
      </div>

      )}
    </div>
  );
}
