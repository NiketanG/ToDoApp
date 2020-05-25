# Todo App

Demo : [TodoApp](https://todoapp-7ee2e.firebaseapp.com/).

A Simple, Serverless and Synced To Do Manager App. 
Built using React and Google Cloud Functions.

### 
### Features

> - Serverless
> - Synced. Login using Google Account. Todos get synced, on all devices.

### Installation

- Configure Firebase and create a project.
- Initialize a local project : ( Firebase-DevTools needs to be installed using npm )
```bash
firebase init
```
- Select Cloud Functions and Hosting. 
- Clone the repo Overwrite existing files. 
- Configure your Firebase Credentials in a config file, and update the paths in Functions. 
- Create OAuth2 Client in Google Cloud Console and Use the Client ID in Client App.
- Fire up the client app using :

```
npm start
```
- Serve functions using :
```
firebase serve
```




### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


### License
[MIT](https://choosealicense.com/licenses/mit/)
