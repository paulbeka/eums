import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import "./CSS/RetriveProfile.css";


const RetriveProfile = () => {
    const navigate = useNavigate();

    const [mail, setMail] = useState("");

    const retrivePsw = async(e: any) => {
        e.preventDefault();
    }

    return (<>
        <Helmet>
            <title>EUMS - Lost Account</title>
            <meta name="description" content="Retrive the password to access your account" />
        </Helmet>
        <div className="retrive-account">
            <form onSubmit={retrivePsw} className="retrive-psw-container">
                <div className="retrive-psw-component">
                    <span>Email:</span>
                    <input className="input-box" value={mail} onChange={(e) => setMail(e.target.value)} type="email"></input>
                </div> 
                <button type="submit" className="submit-btn">Send Mail</button>   
            </form>
        </div>
    </>);
}

export default RetriveProfile;