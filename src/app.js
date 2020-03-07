/**
 * Created by lorne on 2016/12/19.
 */

import React, {Component} from 'react';
import {Platform} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from './store/ConfigureStore';
import './configs/GlobalVariables';
import PuKe from './pages/Root';
import './configs/StorageConfig';
import './I18n/I18n';
import JShareModule from 'jshare-react-native';
import JPush from 'jpush-react-native';
import JMessage from 'jmessage-react-plugin';
import {JPUSH_APPKEY, WX_ID} from './configs/Constants';
import * as WeChat from 'react-native-wechat';

const store = configureStore();


export default class App extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      JShareModule.setup();
    }
  
    WeChat.registerApp(WX_ID);
    JPush.init();
    //连接状态
    this.connectListener = result => {
      console.log('jpush connectListener:' + JSON.stringify(result));
    };
    JPush.addConnectEventListener(this.connectListener);
    JMessage.init({
      appkey: JPUSH_APPKEY,
      isOpenMessageRoaming: true,
      isProduction: true,
    });
  }

  render() {
    return (
      <Provider store={store}>
        <PuKe />
      </Provider>
    );
  }
}
