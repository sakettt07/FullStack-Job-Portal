import React, { useState } from "react";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");


  const handleCityChange=(city)=>{
    setCity(city);
    setSelectedCity(city);
  }
  return <div></div>;
};

export default Jobs;
