import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllErrors, fetchJobs } from "../store/slices/jobSlices";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { cityData, jobPositions } from "../assets/data.js";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const dispatch = useDispatch();

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };
  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]);

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  return (
    <>
      {/* Search bar */}
      <div className="w-full flex justify-center py-4 bg-white">
        <div className="w-full max-w-4xl flex items-center border py-2 px-2 rounded-2xl shadow-xl">
          <input
            id="search-bar"
            placeholder="Search jobs"
            className="px-6 py-2 w-full rounded-md outline-none bg-white"
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-black text-white rounded-xl ml-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter & Jobs Container */}
      <div className="container mx-auto flex flex-col md:flex-row mt-4">
        {/* Filter Section */}
        <div className="hidden md:block w-full md:w-[20%] bg-gray-100 pl-12 pt-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filter by City</h2>
          {cityData.map((city, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={city}
                name="city"
                value={city}
                checked={selectedCity === city}
                onChange={() => handleCityChange(city)}
              />
              <label htmlFor={city} className="ml-2">{city}</label>
            </div>
          ))}
          <h2 className="text-xl font-semibold mt-6 mb-4">Filter by Niche</h2>
          {jobPositions.map((niche, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={niche}
                name="niche"
                value={niche}
                checked={selectedNiche === niche}
                onChange={() => handleNicheChange(niche)}
              />
              <label htmlFor={niche} className="ml-2">{niche}</label>
            </div>
          ))}
        </div>

        {/* Mobile View Filter Dropdown */}
        <div className="block md:hidden w-full p-4">
          <div className="mb-4">
            <label className="block text-sm mb-2">Filter By City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select City</option>
              {cityData.map((city, index) => (
                <option value={city} key={index}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Filter By Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Niche</option>
              {jobPositions.map((niche, index) => (
                <option value={niche} key={index}>
                  {niche}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="w-full md:w-full bg-red-200 p-4 rounded-lg shadow-lg min-h-[200px]">
  {loading ? (
    <div className="flex justify-center items-center h-full">
      <Spinner />
    </div>
  ) : (
    <div>
      {/* Map through jobs and render them */}
      {jobs&&jobs.map((element) => (
        <div className="job-card " key={element._id}>{
          
        }
        </div>
      ))}
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default Jobs;
