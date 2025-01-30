import { AlertTriangle } from "lucide-react";
import "./CSS/ErrorLoading.css";

const ErrorLoading = () => {
  return (
    <div className="error-container">
      <AlertTriangle className="error-icon" />
      <h2 className="error-title">Oops! Something went wrong.</h2>
      <p className="error-message">We couldn't load the content. Please try again later.</p>
      <button 
        className="retry-button"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorLoading;