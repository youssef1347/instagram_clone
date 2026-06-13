import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-emoji">🔍</div>
                <h1 className="not-found-title">404 - Page Not Found</h1>
                <p className="not-found-message">
                The page you are looking for doesn't exist.
                </p>
                <p className="not-found-subtext">
                It might have been removed, or you may have typed the URL incorrectly.
                </p>
                <div className="not-found-actions">
                    <button
                        className="not-found-btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                    <button
                        className="not-found-btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};
