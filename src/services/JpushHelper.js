/**
 * Created by lorne on 2017/5/23.
 */
import JPushModule from 'jpush-react-native';
import {
  Platform,
} from 'react-native';
import {logMsg} from '../utils/ComonHelper';

export default class JpushHelper {
  static getRegistrationID(callback) {
    JPushModule.getRegistrationID(callback);
  }

  static setAlias(alias, successCallback) {
    JPushModule.setAlias({alias,sequence:8});
    JPushModule.resumePush();
  }

  static addPushListener(receiveCb, openCb) {
    if (Platform.OS === 'android') {
      JPushModule.addCustomMessagegListener(receiveCb);
    }

    JPushModule.addNotificationListener(msg => {
      logMsg('jpush接收推送',msg);
      if (msg && msg.notificationEventType === 'notificationArrived') {
        receiveCb(msg);
      }
      if (msg && msg.notificationEventType === 'notificationOpened') {
        openCb(msg);
        setTimeout(() => {
          router.toAboutPage();
        }, 200);
      }
    });
  }

  static removePushListener() {
    JPushModule.removeListener();
  }

  //设置 badge 值
  static iosSetBadge(badge) {
    if (Platform.OS === 'ios') JPushModule.setBadge({badge, appBadge: badge});
  }

  static stopPush() {
    JPushModule.stopPush();
  }
}
