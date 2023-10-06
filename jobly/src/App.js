import React, {useState, useEffect} from "react";
import {BrowserRouter} from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routers from "./routes-nav/Routes";
import JoblyApi from "./api/api";
import { decodeToken} from "react-jwt";
import UserContext from "./auth/UserContext";
import LoadingSpinner from "./common/LoadingSpinner";


// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-token";

/** Jobly application.
 * 
 * - infoLoaded: has user data been pulled from API?
 * - currUser: user obj from API.
 * - token: for logged in users, this is their authentication JWT.
 * - applicationIds: set of IDs of jobs applied to.
 * 
 * App -> Navigation, Routes
*/


function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setcurrentUser] = useState(null);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token,
  );

  /** Load user info from API. Until a user is logged in and they have a token,
   * this should not run. */

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let {username} = decodeToken(token);
          // put the token on the Api class so it can use it to call the API.
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username);
          setcurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setcurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Handles site-wide logout.*/
  function logout() {
    setcurrentUser(null);
    setToken(null);
  }

  /** Handles site-wide signup.
   * 
   * automatically logs them in uopn signup.
   * 
   * make sure you await this function
  */
  async function signup(signupData) {
    try {
      let token = await JoblyApi.signup(signupData);
      setToken(token);
      return {success: true};
    } catch (errors) {
      console.error("signup failed", errors);
      return {success: false, errors};
    }
  }

  /** Handles site-wide login.
   * 
   * make sure you await this function
  */
 async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData);
      setToken(token);
      return {success: true};
    } catch (errors) {
      console.error("login failed", errors);
      return {success: false, errors};
    }
  }

  // checks if a job has been applied for
  function hasAppliedToJob(id) {
    return applicationIds.has(id);
  }

  // apply for a job
  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
      <UserContext.Provider value={{currentUser, setcurrentUser, hasAppliedToJob, applyToJob}}>
        <div className="App">
          <Navigation logout={logout} />
          <Routers login={login} signup={signup} />
        </div>
      </UserContext.Provider>
  );
}

export default App;
