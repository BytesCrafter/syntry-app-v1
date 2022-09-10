// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'http://localhost:8000/api/v1/',
  authToken: '9bc12f10eb077de',
  firebase: {
    apiKey: 'AIzaSyDBy1btu2_RUN2r4tWTtUY2Zhw4oJsum6E',
    authDomain: 'businext-app.firebaseapp.com',
    databaseURL: 'https://businext-app-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'businext-app',
    storageBucket: 'businext-app.appspot.com',
    messagingSenderId: '71633264934',
    appId: '1:71633264934:web:d17444e6bce72b70e6e1e7',
    measurementId: 'G-YHKPV3XFSV'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
