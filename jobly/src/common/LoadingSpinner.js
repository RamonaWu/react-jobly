import React from "react";
import "./LoadingSpinner.css";

/** Show a loading message while waiting for API. */

function LoadingSpinner() {
    return (
        <div className="LoadingSpinner">
            <i className="fas fa-spinner fa-pulse" />
        </div>
    );
}


export default LoadingSpinner;