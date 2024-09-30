import React from "react";
import Lottie from "lottie-react";
import animation from "../assets/error.json";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen relative">
      <div className="flex items-center justify-center ">
        <Lottie
          className="md:w-[80%] mt-48 md:-mt-9 z-0"
          animationData={animation}
          loop={true}
          autoplay
        />
      </div>
        <Link to="/" className="absolute md:bottom-20 md:left-[45.5%] md:px-6 md:py-2 bg-yellow-500 outline-none px-4 py-2 z-10">
          Back to home
        </Link>
    </div>
  );
};

export default NotFound;
