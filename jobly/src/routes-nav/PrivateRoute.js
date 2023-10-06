import React, {useContext} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import UserContext from "../auth/UserContext";


function PrivateRoute({path, children}) {
    const {currentUser} = useContext(UserContext);

    console.debug(
        "PrivateRoute",
        "path=", path,
        "currentUser=", currentUser,
    );

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            <Route path={path} element={{children}} />
        </Routes>
    );
}

export default PrivateRoute;