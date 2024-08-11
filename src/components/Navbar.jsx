import React from "react";

function Navbar(){
    return(
        <div id="nvbarContainer">
            <button id="webCam">Start my Web Cam</button>
            <button id="shareScreen" disabled>Share screen</button>
            <button id="callButton" disabled>call</button>
            <button id="endCall" disabled>End call</button>
            <button id="sendFile" disabled>Send File</button>
            <button id="shareGithubId" disabled>Share Github id</button>
        </div>
    )
}

export default Navbar;