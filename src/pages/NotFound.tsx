import React from "react";
import { useLocation, Link } from 'react-router-dom';
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="containerNotFound">
      <h1>😱 Oops! Page Not Found</h1>
      <p>
        Sorry, the page <strong>{location.pathname}</strong> does not exist. 
        You can go back to the <Link to="/">Home page</Link> or use the navigation to find what you're looking for.
      </p>
    </div>
  );
};

export default NotFound;
