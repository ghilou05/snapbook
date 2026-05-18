import React, { useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "../store/identity/identityState";

const url = "https://picarta.ai/classify";
const apiToken = "DAA1ABT95UA253L328Q9"; // replace this

async function addUserImage(file: File, country: string, uid: string) {
  try {
    
    const storage = getStorage();
    const userDocRef = doc(db, "images", uid);

    // 🔹 1. Upload the image to Firebase Storage
    const storageRef = ref(storage, `users/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // 🔹 2. Get existing document to check for duplicates
    const userDoc = await getDoc(userDocRef);
    let existingImages: any[] = [];
    
    if (userDoc.exists()) {
      existingImages = userDoc.data()?.images || [];
    } else {
      await setDoc(userDocRef, { images: [] });
    }

    // 🔹 3. Check if this country already exists to prevent duplicates
    const isDuplicate = existingImages.some((item: any) => 
      item.country === country && item.imageUrl === imageUrl
    );

    if (isDuplicate) {
      console.log(`⚠️ Duplicate entry for ${country}, skipping...`);
      return { imageUrl, country };
    }

    // 🔹 4. Add the new image entry to Firestore
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




export async function predict_location(file: File, user: User) {
    // Convert image to base64 with proper null handling
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result.split(",")[1]); // remove the data:image/... prefix
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    if (!user) {
      throw new Error("User must be logged in");
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

    // Send the POST request with the payload as JSON data
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Request failed with status code: " + response.status);
        }

        const result = await response.json();
        console.log("AI Prediction Result:", result);
        
        // Only store the image with predicted country - no location coordinates
        await addUserImage(file, result.ai_country, user.id);
        
        return result;
    } catch (error) {
        console.error("Request failed with error:", error);
        throw error;
    }
}

