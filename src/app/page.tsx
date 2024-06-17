// import Image from "next/image";
import React from "react";
import SwapCard from "./SwapCard";
import SwapCard2 from "./SwapCard";
import Button from "./Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-lg font-semibold mb-4">Welcome to My DeFi App</h1>
      <Button />
      <SwapCard2 />
      {/* <SwapCard /> */}
    </div>
  );
}
