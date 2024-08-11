import { addDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const PeerContext = createContext(null);

function PeerUse(){
    return useContext(PeerContext)
}

const servers = {
    iceServers: [{urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],},],iceCandidatePoolSize: 10,
    };

function PeerProvider(props){


    const peer = useMemo(() => new RTCPeerConnection(servers))

    // const sendStream = useCallback()

    // const addingTrack = useCallback((event) => {
    //      // to avoid the  re-render to not mediaStream
        
    //     event.streams[0].getTracks().forEach((track) => {
    //         remoteStream.addTrack(track)
    //         console.log("remoteStream track added");  
    //     })
    // })

    // useEffect(() => {
    //     peer.addEventListener("track", addingTrack)
    //     return (() => {
    //         peer.removeEventListener("track", addingTrack)
    //     })
    // },[peer] )

    // const setRemoteAndLocalDisc = useCallback( async (callData) => {
        
    // },[peer] )

    // const createAnswer = useCallback( async (callDoc) => {

    // },[peer])

    // const setRemoteDisc = useCallback((data) => {
        
    // },[peer] )

    const addingToDoc = useCallback(async (ev , answerCandidates) => {
        ev.candidate && await addDoc( answerCandidates, ev.candidate.toJSON())
        console.log("added candidate");
    })

    const setRemoteIceCandidate = useCallback((change) => {
            const candidate = new RTCPeerConnection(change.doc.data())
            peer.onicecandidate(candidate)
    },[peer] )

    

    return(
        <PeerContext.Provider value={{ peer, setRemoteIceCandidate, addingToDoc

          }} >
            { props.children }
        </PeerContext.Provider>
    )
}


export { PeerUse , PeerProvider  }