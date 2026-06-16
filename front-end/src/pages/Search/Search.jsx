import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "./Search.css";

const buildProfileImage = (profilePic) => {
  if (!profilePic) {
    return `${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-pic.jpg`;
  }
  return profilePic.startsWith("http")
    ? profilePic
    : `${import.meta.env.VITE_BACKEND_URL}/${profilePic}`;
};

export const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setQuery(q);
    if (q.trim()) {
      fetchSearchResults(q);
    } else {
      setResults([]);
      setSubmittedQuery("");
    }
  }, [location.search]);
  console.log(location);
  console.log(query);
  console.log(submittedQuery);

  const fetchSearchResults = async (searchText) => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/api/user/search?query=${encodeURIComponent(searchText)}`,
      );
      setResults(response.data.users || []);
      setSubmittedQuery(searchText);
    } catch (error) {
      toast.error("Could not perform search. Try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSubmittedQuery("");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="search-page-container">
      <div className="search-page-sidebar">
        <div className="search-page-user-card">
          <img
            src={buildProfileImage(user?.profilePic)}
            alt={user?.username}
            className="search-page-user-avatar"
          />
          <div>
            <h3>{user?.username}</h3>
            <p>@{user?.username}</p>
          </div>
        </div>
      </div>

      <main className="search-page-main">
        <div className="search-header">
          <h2>Search Users</h2>
          <p>Search by username or email.</p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {submittedQuery && (
          <div className="search-results-heading">
            <h3>Results for "{submittedQuery}"</h3>
          </div>
        )}

        {isLoading ? (
          <div className="search-loading">Loading users...</div>
        ) : submittedQuery && results.length === 0 ? (
          <div className="search-no-results">
            No users found for "{submittedQuery}".
          </div>
        ) : (
          <div className="search-results-list">
            {results.map((result) => (
              <NavLink
                key={result._id}
                to={`/${result._id}`}
                className="search-result-card"
              >
                <img
                  src={buildProfileImage(result.profilePic)}
                  alt={result.username}
                />
                <div className="search-result-info">
                  <span className="search-result-username">
                    {result.username}
                  </span>
                  <span className="search-result-bio">
                    {result.bio || "No bio available."}
                  </span>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
