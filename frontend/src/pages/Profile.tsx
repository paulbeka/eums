import { useEffect } from "react";
import { useParams } from "react-router-dom";


export const Profile = () => {
  const { username } = useParams();

  const isMyProfile = () => {
    return false;
  }

  useEffect(() => {

  }, []);

  return (
    <div className="profile-container">
      <div>
        <img src=""/>
        <h2>Name</h2>
        <h4>Gender, date of birth</h4>
      </div>
    </div>
  )
}