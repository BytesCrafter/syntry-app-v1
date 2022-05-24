// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'http://localhost:8000/v1/api/',
  authToken: '2bb22f08eb0770d',
  firebase: {
    apiKey: 'AIzaSyDBy1btu2_RUN2r4tWTtUY2Zhw4oJsum6E',
    authDomain: 'businext-app.firebaseapp.com',
    projectId: 'businext-app',
    storageBucket: 'businext-app.appspot.com',
    messagingSenderId: '71633264934',
    appId: '1:71633264934:web:371daa3cf8e8be68e6e1e7',
    measurementId: 'G-E329JC1KZR'
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
