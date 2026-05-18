import React, { useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { auth, storage } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from "./Navbar";
import Header from "./Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const url = "https://picarta.ai/classify";
const apiToken = "DAA1ABT95UA253L328Q9";
const ghilesToken = "E50LE12VKRH6EA0GICL4";

async function addUserLocation(userID, latitude, longitude) {
  const userRef = doc(db, "locations", userID);

  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, { locations: [] });
      console.log(`Created new user document for "${userID}"`);
    }

    await updateDoc(userRef, {
      locations: arrayUnion({ latitude, longitude })
    });

    console.log(
      `Added location (${latitude}, ${longitude}) to user "${userID}"`
    );
  } catch (error) {
    console.error("Error adding location:", error);
  }
}

async function addUserImage(file, country) {
  try {
    const user = auth.currentUser;

    const uid = user.uid;
    const storage = getStorage();
    const userDocRef = doc(db, "images", uid);

    // 🔹 1. Upload the image to Firebase Storage
    const storageRef = ref(storage, `users/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // 🔹 2. Ensure the Firestore document exists before updating
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { images: [] });
    }

    // 🔹 3. Add the new image entry to Firestore
    await updateDoc(userDocRef, {
      images: arrayUnion({
        imageUrl,
        country,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log(`✅ Added image for ${country} to user ${uid}`);
    return { imageUrl, country };
  } catch (error) {
    console.error("❌ Error adding image with country:", error);
  }
}



export async function predict_location(file) {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // remove the data:image/... prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user");
      return null;
    }
    const headers = { "Content-Type": "application/json" };

    let country_code = null;
    let center_latitude = null;
    let center_longitude = null;
    let radius = null;
    let top_k = 3; // You can choose up to 10 GPS predictions. The default is 3


    // Prepare the payload
    const payload = {
        "TOKEN": apiToken,
        "IMAGE": base64,
        "TOP_K": top_k,
        "COUNTRY_CODE": country_code,
        "Center_LATITUDE": center_latitude,
        "Center_LONGITUDE": center_longitude,
        "RADIUS": radius,
    };

    const payload3 = {
      "TOKEN": ghilesToken,
      "IMAGE": base64,
      "TOP_K": top_k,
      "COUNTRY_CODE": country_code,
      "Center_LATITUDE": center_latitude,
      "Center_LONGITUDE": center_longitude,
      "RADIUS": radius,
    }

    // Send the POST request with the payload as JSON data
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload3)
      });
      if (!response.ok) {
        throw new Error("Request failed with status code: " + response.status);
      }
      const result = await response.json();
      console.log(result);
      if (result.center_latitude != null && result.center_longitude != null) {
        addUserLocation(user.uid, result.center_latitude, result.center_longitude);
      }
      if (result.ai_country != null) {
        addUserImage(file, result.ai_country);
      }
      return result;
    } catch (error) {
      console.error("Request failed with error:", error);
      return null;
    }
}



function getAddressFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Address:", data);
      return data.display_name;
    });
}


function TakePhoto() {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    const user = auth.currentUser;
    setSelectedFile(file);
    const result = await predict_location(file);
    
    console.log("Predicted location:", result);
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "70px", // space for fixed header
        paddingBottom: "70px", // space for fixed navbar
        boxSizing: "border-box",
      }}
    >
      {/* Header anchored to the top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header />
      </div>

      {/* Main centered content */}
      <div style={{ width: "100%", maxWidth: 720, padding: 20 }}>
        <h2 style={{ marginTop: 0, color: "#fff" }}>Photo Upload</h2>

        <input
          type="file"
          accept="image/*"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <label
          htmlFor="fileInput"
          style={{
            padding: "10px 20px",
            background: "#00ffff77",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          📷 Choose Photo
        </label>
      </div>

      {/* Navbar anchored to the bottom */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0 }}>
        <Navbar />
      </div>
    </div>
  );
}


export default TakePhoto;
