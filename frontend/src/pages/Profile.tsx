import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserData } from "../components/api/Api";
import { Helmet } from 'react-helmet-async';
import { useAuth } from "../components/auth/AuthContext";
import { jwtDecode } from "jwt-decode";
import "./CSS/Profile.css";

interface UserProfile {
  full_name: string;
  email: string;
  date_of_birth: string;
  country: string;
  gender: string;
  profilePicture: string | null;
  posts: number;
  likes: number;
}

export const Profile = () => {
  const { username } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const getAllData = () => {
    // Download all user data
  }

  const deleteAccount = () => {
    // Delete user account
  }

  const goToSettings = () => {
    navigate("/settings");
  }

  const signOut = () => {
    logout();
    navigate("/");
  }

  useEffect(() => {
    if (username) {
      getUserData(username).then((data: UserProfile) => {
        setUserData(data);
      });
    }
    if (localStorage.getItem("access_token")) {
      setIsMyProfile(jwtDecode(localStorage.getItem("access_token")!)["sub"] === username);
    }
  }, [username]);

  return (<>
    <Helmet>
      <title>{userData?.full_name || "Profile"} - EU Made Simple</title>
      <meta name="description" content={`Profile for ${userData?.full_name || "User"}`} />
    </Helmet>
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={userData?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="profile-name">{userData?.full_name || "Loading..."}</h2>
        <p className="profile-info">
          {userData?.gender || "Not specified"}, {userData?.date_of_birth || "Not provided"}
        </p>
        <p className="profile-location">📍 {userData?.country || "Unknown"}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <p className="stat-value">{userData?.posts || 0}</p>
            <p className="stat-label">Posts</p>
          </div>
          <div className="profile-stat">
            <p className="stat-value">{userData?.likes || 0}</p>
            <p className="stat-label">Likes</p>
          </div>
        </div>
        {isMyProfile && 
          <div className="profile-edit">
            <button className="setting-button" onClick={goToSettings}><span>Edit Profile</span></button>
            <button className="setting-button" onClick={signOut}><span>Logout</span></button>
            <button className="setting-button" onClick={getAllData}><span>Download my Data</span></button>
            <button style={{ background: "red" }} className="setting-button" onClick={deleteAccount}>
              <span>Delete Account</span>
            </button>
          </div>
        }
      </div>
    </div>
  </>);
};
