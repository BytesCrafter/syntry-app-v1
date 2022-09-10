// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDBy1btu2_RUN2r4tWTtUY2Zhw4oJsum6E',
  authDomain: 'businext-app.firebaseapp.com',
  databaseURL: 'https://businext-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'businext-app',
  storageBucket: 'businext-app.appspot.com',
  messagingSenderId: '71633264934',
  appId: '1:71633264934:web:d17444e6bce72b70e6e1e7',
  measurementId: 'G-YHKPV3XFSV'
 });
const messaging = firebase.messaging();
