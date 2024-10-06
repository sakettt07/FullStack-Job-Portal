import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllErrors, fetchJobs } from "../store/slices/jobSlices";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { cityData, jobPositions } from "../assets/data.js";
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [jobsPerPage] = useState(6);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchKeyword);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchKeyword]);

  // Handle city change
  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  // Handle niche change
  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  // Main effect for fetching jobs
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
    dispatch(fetchJobs(city, niche, debouncedSearchTerm));
  }, [dispatch, error, city, niche, debouncedSearchTerm]);

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when searching
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  // Handle enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Pagination logic
  const offset = currentPage * jobsPerPage;
  const currentJobs = jobs.slice(offset, offset + jobsPerPage);
  const pageCount = Math.ceil(jobs.length / jobsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setCity("");
    setSelectedCity("");
    setNiche("");
    setSelectedNiche("");
    setSearchKeyword("");
    setCurrentPage(0);
  };

  return (
    <>
      {/* Search bar */}
      <div className="w-full flex justify-center py-4 bg-white">
        <div className="w-full max-w-4xl flex items-center border py-2 px-2 rounded-2xl shadow-xl">
          <input
            id="search-bar"
            placeholder="Search jobs (comma-separated terms allowed)"
            className="px-6 py-2 w-full rounded-md outline-none bg-white"
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
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
          <div className="flex justify-between items-center mb-4 pr-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Filter by City</h2>
          {cityData.map((cityItem, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={cityItem}
                name="city"
                value={cityItem}
                checked={selectedCity === cityItem}
                onChange={() => handleCityChange(cityItem)}
              />
              <label htmlFor={cityItem} className="ml-2">
                {cityItem}
              </label>
            </div>
          ))}

          <h2 className="text-xl font-semibold mt-6 mb-4">Filter by Niche</h2>
          {jobPositions.map((nicheItem, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={nicheItem}
                name="niche"
                value={nicheItem}
                checked={selectedNiche === nicheItem}
                onChange={() => handleNicheChange(nicheItem)}
              />
              <label htmlFor={nicheItem} className="ml-2">
                {nicheItem}
              </label>
            </div>
          ))}
        </div>

        {/* Mobile View Filter */}
        <div className="block md:hidden w-full p-4">
          <div className="mb-4">
            <label className="block text-sm mb-2">Filter By City</label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
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
              onChange={(e) => handleNicheChange(e.target.value)}
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
        <div className="w-full md:w-[80%] bg-zinc-900 p-4 rounded-lg shadow-lg min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              {currentJobs.length === 0 ? (
                <div className="text-white text-center py-8">
                  No jobs found matching your criteria
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentJobs.map((element) => (
                      <div
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 ease-in-out"
                        key={element._id}
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {element.title}
                        </h3>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Company: </span>
                          {element.companyName}
                        </p>
                        <p className="text-gray-600 mb-4">
                          <span className="font-medium">Location: </span>
                          {element.location}
                        </p>
                        <p className="text-gray-700 mb-4">
                          <span className="font-medium">Salary: </span>₹
                          {element.salary}
                        </p>
                        <p
                          className={`${
                            element.hiringMultipleCandidates === "Yes"
                              ? "text-green-600"
                              : "text-yellow-600"
                          } font-medium mb-4`}
                        >
                          {element.hiringMultipleCandidates === "Yes"
                            ? "Hiring Multiple Candidates"
                            : "Hiring"}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                          <span className="font-medium">Posted On: </span>
                          {element.jobPostedOn.substring(0, 10)}
                        </p>
                        <div className="flex justify-center">
                          <Link
                            to={`/post/application/${element._id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination flex justify-center mt-8 space-x-2'}
                    pageClassName={'border rounded px-3 py-1'}
                    pageLinkClassName={'text-white'}
                    activeClassName={'bg-blue-500 border-blue-500'}
                    activeLinkClassName={'text-white'}
                    previousClassName={'bg-white border rounded px-3 py-1'}
                    nextClassName={'bg-white border rounded px-3 py-1'}
                    previousLinkClassName={'text-blue-500'}
                    nextLinkClassName={'text-blue-500'}
                    disabledClassName={'text-gray-300'}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;