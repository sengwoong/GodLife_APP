/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

if (__DEV__) {
  import('./msw.polyfills')
    .then(() => import('./mocks/server'))
    .then(({ server }) => {
      server.listen();
    })
    .catch(error => {
      console.error('MSW initialization failed:', error);
    });
}

AppRegistry.registerComponent(appName, () => App);
