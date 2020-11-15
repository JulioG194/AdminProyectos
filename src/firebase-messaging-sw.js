importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js'
);

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

const messaging = firebase.messaging();
