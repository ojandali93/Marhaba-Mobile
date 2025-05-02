import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ProfileProvider } from './src/Context/ProfileContext';

const Root = () => (
  <ProfileProvider>
    <App />
  </ProfileProvider>
);

AppRegistry.registerComponent(appName, () => Root);