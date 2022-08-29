// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCmJaB6O6et28ChK2yACmGEjV-i0f3UbN4',
    authDomain: 'spartan-figure-294709.firebaseapp.com',
    databaseURL: 'https://spartan-figure-294709-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'spartan-figure-294709',
    storageBucket: 'spartan-figure-294709.appspot.com',
    messagingSenderId: '101960398024',
    appId: '1:101960398024:web:e7f0bfe7ab52546c6761fd',
    measurementId: 'G-DX6S778X4W'
 });
const messaging = firebase.messaging();
