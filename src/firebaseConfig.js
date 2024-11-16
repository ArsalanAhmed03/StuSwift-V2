import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAZ6ArCbWr-xTU1no8PrWA9yH8WvF3HHns",
    authDomain: "stuswift-android.firebaseapp.com",
    projectId: "stuswift-android",
    storageBucket: "stuswift-android.appspot.com",
    messagingSenderId: "853136188152",
    appId: "1:853136188152:android:0abcc01b8a9a074ad1d10d",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
