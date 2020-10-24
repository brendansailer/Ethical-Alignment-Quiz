import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDhISQsIfZW4z9gzt37_MHPcIwr8J5GvKI",
  authDomain: "irish-hacks.firebaseapp.com",
  databaseURL: "https://irish-hacks.firebaseio.com",
  projectId: "irish-hacks",
  storageBucket: "irish-hacks.appspot.com",
  messagingSenderId: "20151175746",
  appId: "1:20151175746:web:68265011fbd080f058fbdb",
  measurementId: "G-XZK4GY579Z"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();