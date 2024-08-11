import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import conf from "./conf.json"

const firebaseConfig = {
  apiKey: conf.REACT_APP_APIKEY,
  authDomain: conf.REACT_APP_AUTHDOMAIN,
  projectId: conf.REACT_APP_PROJECTID,
  storageBucket: conf.REACT_APP_STORAGEBUCKET,
  messagingSenderId: conf.REACT_APP_MESSAGINGSENDERID,
  appId: conf.REACT_APP_APPID,
  measurementId: conf.REACT_APP_MEASUREMENTID
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
