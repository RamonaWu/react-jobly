import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import CompanyList from "../companies/CompanyList";
import CompanyDetail from "../companies/CompanyDetail";
import JobList from "../jobs/JobList";
import ProfileForm from "../profiles/ProfileForm";

/** Site-wide routes
 * 
 * Parts of site should only be visitable when logged in. 
 * Those routes are wrapped by <PrivateRoute>, which is an authorization component.
 * 
 * Visiting a non-existant route redirects to the homepage.
*/

function Routers({ login, signup }) {
    console.debug(
        "Routes",
        `login=${typeof login}`,
        `register=${typeof register}`,
    );

    return (
        <div className="pt-5">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginForm login={login} />} />
                <Route path="/signup" element={<SignupForm signup={signup} />} />
                <Route path="/companies" element={
                                            <PrivateRoute>
                                                <CompanyList />
                                            </PrivateRoute>} />
                <Route path="/companies/:handle" element={
                                            <PrivateRoute>
                                                <CompanyDetail />
                                            </PrivateRoute>} />
                <Route path="/jobs" element={
                                            <PrivateRoute>
                                                <JobList />
                                            </PrivateRoute>} />
                <Route path="/profile" element={
                                            <PrivateRoute>
                                                <ProfileForm />
                                            </PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default Routers;