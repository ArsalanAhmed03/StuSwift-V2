import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//     apiKey: "AIzaSyAZ6ArCbWr-xTU1no8PrWA9yH8WvF3HHns",
//     authDomain: "stuswift-android.firebaseapp.com",
//     projectId: "stuswift-android",
//     storageBucket: "stuswift-android.appspot.com",
//     messagingSenderId: "853136188152",
//     appId: "1:853136188152:android:0abcc01b8a9a074ad1d10d",
// };

const firebaseConfig = {
    apiKey: "AIzaSyBpDrfqPisMpldePPn-paEUv7vUfb8CME4",
    authDomain: "stuswift-eb2f0.firebaseapp.com",
    projectId: "stuswift-eb2f0",
    storageBucket: "stuswift-eb2f0.firebasestorage.app",
    messagingSenderId: "325110710893",
    appId: "1:325110710893:web:12636e4c72c389dd91f564",
    measurementId: "G-E8B8YTVKGJ"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
