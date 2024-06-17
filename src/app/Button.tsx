"use client";
import React, { useState } from "react";

export default function Button() {
  const [buttonText, setButtonText] = useState("Sign in with MetaMask");

  const handleSignIn = async () => {
    //check the presence of metamask in the browser
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setButtonText("You are connected");
      } catch (error) {
        console.error(error);
        setButtonText("Connection failed");
      }
    } else {
      setButtonText("Install MetaMask");
    }
  };

  return (
    <div>
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleSignIn}
      >
        {buttonText}
      </button>
    </div>
  );
}
