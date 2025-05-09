import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ProfileProvider } from './src/Context/ProfileContext';

import * as amplitude from '@amplitude/analytics-react-native';

import {amplitudeKey} from './src/Services/Amplitude';
amplitude.init(amplitudeKey);

const Root = () => (

  <ProfileProvider>
    <App />
  </ProfileProvider>
);

AppRegistry.registerComponent(appName, () => Root);