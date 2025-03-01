/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { enableMocking } from './server/common/types/constants';

if (__DEV__ && enableMocking) {
  import('./msw.polyfills')
    .then(() => import('./server/mocks/server'))
    .then(({ server }) => {
      server.listen();
    })
    .catch(error => {
      console.error('MSW initialization failed:', error);
    });
}

AppRegistry.registerComponent(appName, () => App);
