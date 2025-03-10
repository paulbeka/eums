import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Mock fetch user data
    setUserData({
      full_name: "John Doe",
      email: "johndoe@example.com",
      date_of_birth: "1995-05-20",
      country: "France",
      gender: "Male",
      profilePicture: null,
      posts: 42,
      likes: 1280,
    });
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={userData?.profilePicture ? userData.profilePicture : "https://avatars.githubusercontent.com/u/14959?v=4"}
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="profile-name">{userData?.full_name || "Loading..."}</h2>
        <p className="profile-info">{userData?.gender}, {userData?.date_of_birth}</p>
        <p className="profile-location">📍 {userData?.country}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <p className="stat-value">{userData?.posts}</p>
            <p className="stat-label">Posts</p>
          </div>
          <div className="profile-stat">
            <p className="stat-value">{userData?.likes}</p>
            <p className="stat-label">Likes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
