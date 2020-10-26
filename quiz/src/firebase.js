import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCD-RId2Onu7EkJoIJtMSQFelTsVTzWTew",
  authDomain: "ethics-final-webpage.firebaseapp.com",
  databaseURL: "https://ethics-final-webpage.firebaseio.com",
  projectId: "ethics-final-webpage",
  storageBucket: "ethics-final-webpage.appspot.com",
  messagingSenderId: "405016414702",
  appId: "1:405016414702:web:488d572df4d5ebd05aa6ff",
  measurementId: "G-3CK90C4NEG"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();