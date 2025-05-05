import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ProfileProvider } from './src/Context/ProfileContext';

const Root = () => (

  // let firebasepApp = app;

  <ProfileProvider>
    <App />
  </ProfileProvider>
);

AppRegistry.registerComponent(appName, () => Root);