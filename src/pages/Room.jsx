import React, { useCallback, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { PeerUse } from "../contexts/PeerContext.jsx";
import { firestore } from "../server/firestorePro.js";
// import ReactPlayer from "react-player";
import { addDoc, collection, doc, FieldPath, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore"; 

function Room(){

    const [webCamButton, setWebCamButton] = useState(false)
    const [callButton, setCallButton] = useState(true)
    const [answerButton, setAnswerButton] = useState(true)
    const [endButton, setEndButton] = useState(true)
    const [callInput, setCallInput] = useState("")
    const [valueCange, setValueChange] = useState("")

    const { peer , setRemoteIceCandidate, addingToDoc } = PeerUse(); 
    const localRef = useRef(null)
    const remoteRef = useRef(null)

    const handleWebcam = useCallback( async () => {
        const localStream = await navigator.mediaDevices.getUserMedia( { video : true, audio : false } )
        const remoteStream = new MediaStream() 

        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream)
            console.log("localstream track added")
        })

        // Pull tracks from remote stream, add to video stream
        peer.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
              remoteStream.addTrack(track);
              console.log("remoteStream track added")
            });
          };

        localRef.current.srcObject = localStream  //as null is equall only in initial render
        remoteRef.current.srcObject = remoteStream

        setAnswerButton(false);
        setCallButton(false);
        setWebCamButton(true);
    })

    const handleCallButton = useCallback( async () => {
        const callDoc =  doc(collection(firestore, "calls")) ;//document in calls collection
        const offerCandidates = collection(callDoc ,"offerCandidates");//sub_collection
        const answerCandidates = collection( callDoc , "answerCandidates");//sub_collection
    
        setCallInput(callDoc.id)
        
        peer.onicecandidate = async (ev) => {
            ev.candidate && await addDoc(offerCandidates ,ev.candidate.toJSON());
            console.log("added candidate");
        }

        const offerDescription = await peer.createOffer();
        await peer.setLocalDescription(offerDescription)
        
        const offer = {
            sdp : offerDescription.sdp,
            type : offerDescription.type
        }

        await setDoc(callDoc, { offer })

        onSnapshot(callDoc , (snapshot) => {
            const data = snapshot.data() ;
            // console.log("Snap shot data", data);
            if (!peer.currentRemoteDescription && data?.answer){
                const answerDescription = new RTCPeerConnection(data.answer)
                peer.onicecandidate(answerDescription)
            }
        })

        onSnapshot( answerCandidates ,(snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added"){
                    setRemoteIceCandidate(change)
                }
            })
        })

        setEndButton(false)
        setAnswerButton(false)
    })

    const handleAnswerButton = useCallback(async () => {

        const callId  = callInput
        const callDoc = doc(collection( firestore,"calls"), callId);
        const offerCandidates = collection(callDoc, "offerCandidates")
        const answerCandidates = collection(callDoc , "answerCandidates") 
        
        peer.onicecandidate = async (ev) => {
            addingToDoc(ev, answerCandidates)
        }
        
        const callData = (await getDoc(callDoc))?.data().offer ;
        // console.log( (await getDoc(callDoc))?.data().offer );

        const offerDescription = callData;
        // console.log(offerDescription);
        await peer.setRemoteDescription(offerDescription);
        
        const answerDescription = await peer.createAnswer();
        await peer.setLocalDescription(answerDescription);
        
        // console.log(answerDescription);
        
        const answer = {
            sdp : answerDescription.sdp,
            type : answerDescription.type
        }

        await updateDoc(callDoc, { answer } )

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if(change.type === "added"){
                    setRemoteIceCandidate(change)
                }
            })
        })

        setEndButton(false)
    })

    return(
        <div id="roomContainer">
            <h1>{`Welcome to <RandoMeet>`}</h1>
            <div id="videoContainer">
                <video id="localVideo" ref={localRef} autoPlay playsInline></video>
                <video id="remoteVideo" ref={remoteRef} autoPlay playsInline></video>
            </div>
            <h2>{`Finding Your <RandoPeer>...`}</h2>
            
            <input value={callInput} onChange={(e) => {setCallInput(e.target.value)}} id="callInput"/> 
            <button id="answerButton" onClick={handleAnswerButton} disabled={answerButton}>Answer</button>

            <div id="nvbarContainer">
            
            <button id="webCam" onClick={ handleWebcam } disabled={webCamButton} >Start my Web Cam</button>
            <button id="shareScreen" disabled >Share screen</button>
            <button id="callButton" onClick={handleCallButton} disabled={callButton} >call</button>
            <button id="endCall" disabled={endButton} >End call</button>
            <button id="sendFile" disabled>Send File</button>
            <button id="shareGithubId" disabled>Share Github id</button>
            
            </div>

        </div>
    )
}
export default Room;