import React from "react";
import Lottie from "lottie-react";
import animation from "../assets/error.json";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center ">
        <Lottie
          className="md:w-[80%] md:-mt-9 z-0"
          animationData={animation}
          loop={true}
          autoplay
        />
      </div>
        <Link to="/" className=" md:px-6 md:py-2 md:-mt-20 mt-12 bg-yellow-500 outline-none px-4 py-2 z-10">
          Back to home
        </Link>
    </div>
  );
};

export default NotFound;
