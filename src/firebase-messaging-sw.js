// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js'
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAVxruttqstvTjFjwZFaPlisVVYZEdDoTY",
    authDomain: "epn-gugo.firebaseapp.com",
    databaseURL: "https://epn-gugo.firebaseio.com",
    projectId: "epn-gugo",
    storageBucket: "epn-gugo.appspot.com",
    messagingSenderId: "19895797824",
    appId: "1:19895797824:web:708ec69d8f5bdee09537a5",
    measurementId: "G-HVGBC6KN2T"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
