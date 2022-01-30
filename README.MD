# Syntry

Syntry is a desktop application for BusiNext, a CRM solution developed by Bytescrafter. The initial purpose of this app is to be used by the employee that needs to timein and timeout to the BusiNext CRM solution. In the future, the project will have features such as chats and montioring tools.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Running the Application

A. To run the Web application

```
ng serve
```

B. To run the Desktop application

```
npm run electron
```

### Packaging the Application for Windows

1. Please make sure to build angular when you make changes to src folder.

```
ng build
```

2. Build the unpacked windows application.

```
npm run pack
```

Note: Use the dist/win-ia32-unpacked

### Publishing to Windows Store

1. Run this command on CMD then provide all the necessary information.

```
electron-windows-store --publisher-display-name 'Company Name' --identity-name '57848CompanyName.App' --package-version 1.0.0.0
```

2. Use the .appx build and submit it on Microsoft Partner Center.

```
It is important to signed your build using yung CN=XXXX-XXX-XXXXX-XXXXXX
```

## Generate new PWA icons and name.

1. Make sure to update name and shortname on manifest.webmanifest on src
2. ngx-pwa-icons is required to be able to generate PWA icons. Install globally
3. Run this command: ./icon.png <-- Update this image, this will be use on generation.
```
ngx-pwa-icons
```

## Publish to firebase

1. Publish to the specific site.

```
firebase deploy --only hosting:syntry
```

Optionally! Set on firebase.json
```
"site": "syntry",
```

## Built With

* [ElectronJS](https://electron.org/) - Desktop App Container

## Contributing

Please read [CONTRIBUTING](CONTRIBUTING) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BytesCrafter/BusiNext-Syntry/tags).

## Authors

* **Bytes Crafter** - *Initial work* - [Github](https://github.com/BytesCrafter/BusiNext-Syntry)

See also the list of [contributors](https://github.com/BytesCrafter/BusiNext-Syntry/graphs/contributors) who participated in this project.

## License

This project is licensed under the GNU GPL License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Electron.org
