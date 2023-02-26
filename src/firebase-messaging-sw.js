// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDnsq9Xqk5aKopuR6RbFiBskefhffFtM-s",
    authDomain: "erpatsystem.firebaseapp.com",
    projectId: "erpatsystem",
    storageBucket: "erpatsystem.appspot.com",
    messagingSenderId: "1067070318526",
    appId: "1:1067070318526:web:f8b2a61e604ed0a978bbef",
    measurementId: "G-3Q81V0GRN6"
 });
const messaging = firebase.messaging();
