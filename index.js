/**
 * @format
 */

import {
  AppRegistry
} from 'react-native';
import App from './src/app';
if (!__DEV__) {
  global.console = {
      info: () => {},
      log: () => {},
      assert: () => {},
      warn: () => {},
      debug: () => {},
      error: () => {},
      time: () => {},
      timeEnd: () => {},
  };
}

AppRegistry.registerComponent('DeshHike', () => App);
