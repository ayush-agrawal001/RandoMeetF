import React from "react";
import { useNavigate } from "react-router-dom";


const Home = ()  => {
    const navigate = useNavigate()  
    return(
    <div className ="home_container">
        <button onClick={() => {navigate(`/room`)}} type="submit" className="login-with-google-btn">
            Sign in with Github
        </button>
    </div>
    )
}

export default Home;