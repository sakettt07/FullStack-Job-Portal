import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
    name: "jobs",
    initialState: {
        jobs: [],
        loading: false,
        error: null,
        message: null,
        singleJob: {},
        myJobs: []
    },
    reducers: {
        requestForAllJobs(state) {
            state.loading = true;
            state.error = null;
        },
        successForAllJobs(state, action) {
            state.loading = false;
            state.jobs = action.payload;
        },
        failureForAllJobs(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearAllErrors(state) {
            state.error = null;
        },
        resetJobSlice(state) {
            state.error = null;
            state.loading = false;
            state.message = null;
            state.singleJob = {};
        }
    }
});

export const fetchJobs = (city = "", niche = "", searchKeyword = "") => async (dispatch) => {
    try {
        dispatch(jobSlice.actions.requestForAllJobs());
        
        // Prepare search parameters
        const searchParams = new URLSearchParams();
        
        // Handle comma-separated search terms
        if (searchKeyword) {
            const searchTerms = searchKeyword.split(',').map(term => term.trim()).filter(Boolean);
            if (searchTerms.length > 0) {
                searchParams.append('keywords', searchTerms.join(','));
            }
        }
        
        if (city) {
            searchParams.append('city', city);
        }
        
        if (niche) {
            searchParams.append('niche', niche);
        }
        
        const queryString = searchParams.toString();
        const link = `http://localhost:4000/api/v1/job/getall${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(link, { withCredentials: true });
        dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
    } catch (error) {
        dispatch(jobSlice.actions.failureForAllJobs(
            error.response?.data?.message || "An error occurred while fetching jobs"
        ));
    }
};

export const { clearAllErrors, resetJobSlice } = jobSlice.actions;

export default jobSlice.reducer;