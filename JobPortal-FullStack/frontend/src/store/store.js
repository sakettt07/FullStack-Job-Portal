import {configureStore} from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlices";

const store =configureStore({
    reducer:{
        jobs:jobReducer
    }
})

export default store;