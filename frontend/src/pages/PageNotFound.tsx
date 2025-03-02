import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import "./CSS/PageNotFound.css";

const PageNotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - EUMS</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
      </Helmet>
      <div className="page-not-found-container">
        <img width="300px" src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg" />
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          Go back to Homepage
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;