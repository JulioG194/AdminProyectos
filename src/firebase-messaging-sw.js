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


self.addEventListener('push', event => {
  const notification = event.data.json();
  console.log(notification)
  const data = JSON.parse(notification.data.notification);
  console.log(data);
  self.registration.showNotification(notification.notification.title, data);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  console.log('event', event.notification);
  if (event.action === 'ok') {
    console.log(event.action);
      event.waitUntil(
      clients.openWindow(event.notification.data.click_action_web)
    );
  }
});
