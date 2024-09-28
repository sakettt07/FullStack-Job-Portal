import React from "react";

const Spinner = () => {
  return (
    <div>
      <div class="relative flex justify-center items-center">
        <div class="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          class="rounded-full h-20 w-16"
        />
      </div>
    </div>
  );
};

export default Spinner;
