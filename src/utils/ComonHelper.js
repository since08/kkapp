/**
 * Created by lorne on 2017/1/12.
 */
import {PixelRatio, Alert, Share, Platform, Linking,PermissionsAndroid} from 'react-native';
import Toast from 'react-native-root-toast';
import md5 from 'react-native-md5';
import I18n from '../I18n/I18n';
import moment from 'moment';
import {LoginUser, setLoginUser, removeToken} from '../services/AccountDao';
import StorageKey from '../configs/StorageKey';
import {Verified, SellStatus} from '../configs/Status';
import Communications from 'react-native-communications';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../Themes';
import * as wechat from 'react-native-wechat';
import * as Constants from '../configs/Constants';
import {getApiType} from '../services/RequestHelper';
import _ from 'lodash';
import JMessage from 'jmessage-react-plugin';
import Geolocation from 'react-native-geolocation-service';
import {checkPermission} from "../pages/comm/Permission";

export const YYYY_MM_DD = 'YYYY.MM.DD';
export const DATA_SS = 'YYYY-MM-DD HH:mm:ss';
export const YYYY_MM = 'YYYY-MM';
export const YYYY年MM月 = 'YYYY年MM月';
export const YYYYMMDD = 'YYYYMMDD';
export const MM_DD = 'MM-DD';

const HOST = 'https://kkh5.deshpro.com/';
const THOST = 'http://test.kkh5.deshpro.com/';

export const util = _;

export function shareHost() {
  if (getApiType() === 'production') return HOST;
  else return THOST;
}

export const loadApp = HOST + 'loadAPP';
export const picker = {
  width: 500,
  height: 500,
  cropping: true,
  cropperCircleOverlay: true,
  compressImageMaxWidth: 800,
  compressImageMaxHeight: 600,
  compressImageQuality: 0.5,
};

export function getAllPermission(){
  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple(
      [PermissionsAndroid.PERMISSIONS.CAMERA, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      ).then((result) => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
        && result['android.permission.CAMERA']
        && result['android.permission.ACCESS_FINE_LOCATION']
        && result['android.permission.READ_EXTERNAL_STORAGE']
        && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
         console.log(result)
        } else if (result['android.permission.ACCESS_COARSE_LOCATION']
        || result['android.permission.CAMERA']
        || result['android.permission.ACCESS_FINE_LOCATION']
        || result['android.permission.READ_EXTERNAL_STORAGE']
        || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
          showToast('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
        }
      });
  }
}

export function getPosition(resolve, reject) {
  checkPermission('location', ret => {
    Geolocation.getCurrentPosition(
      data => {
        const {coords} = data;
        logMsg('iOS定位', data);
        resolve && resolve(coords);
      },
      err => {
        logMsg('iOS定位', err);
        reject && reject(err);
      },
      {enableHighAccuracy: Platform.OS !== 'android', timeout: 10000},
    );
  });
}

/**
 *
 * @param amap_location
 * @param amap_navigation_url
 * @param amap_poiid
 * @param location
 */
export function turn2MapMark(
  amap_location,
  amap_navigation_url,
  amap_poiid,
  location,
  title,
  targetAppName,
) {
  let lat = '',
    lon = '',
    appUri = '';
  if (strNotNull(amap_location)) {
    let arr = amap_location.split(',');
    if (arr.length === 2) {
      lon = arr[0];
      lat = arr[1];
    }
  }

  if (Platform.OS === 'ios') {
    if (targetAppName === 'gaode') {
      appUri = `iosamap://path?sourceApplication=macuahike&slat=&slon=&sname=&dlat=${lat}&dlon=${lon}&dname=${title}&dev=0&m=0&t=0`;
    } else if (targetAppName === 'pingguo') {
      // http:maps.apple.com/?daddr=${lon},${lat},${title}
      appUri = `http://maps.apple.com/?daddr=${title}&ll=${amap_location}`;
    }
  } else {
    appUri = `amapuri://route/plan/?dlat=${lat}&dlon=${lon}&dname=${title}&dev=0&t=0`;
    // appUri = `uri.amap.com/navigation?to=${amap_location},endpoint&via=midwaypoint&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
    console.log('sjkdjs', appUri);
  }

  if (strNotNull(lon) && strNotNull(lat))
    Linking.openURL(appUri).catch(e => {
      console.warn(e);
      if (strNotNull(amap_navigation_url)) {
        if (Platform.OS === 'ios')
          router.toWebViewPage('', amap_navigation_url);
        else Linking.openURL(amap_navigation_url);
      }
    });
  else if (strNotNull(amap_navigation_url))
    if (Platform.OS === 'ios') router.toWebViewPage('', amap_navigation_url);
    else Linking.openURL(amap_navigation_url);
}

/**
 * 地图标注
 * @param lon 经度
 * @param lat 纬度
 * @param targetAppName
 * @param name
 */
export function turn2MapMark2(
  amap_navigation_url,
  poiid = 'B000AAFAC5',
  amap_location,
) {
  let targetAppName = 'gaode';
  let url = amap_navigation_url;
  let webUrl = `http://uri.amap.com/poidetail?poiid=${poiid}&src=macuahike&callnative=1`;
  let webUrlGaode = `http://uri.amap.com/poidetail?poiid=${poiid}&src=macuahike&callnative=1`;
  let webUrlGaode_ios = `http://uri.amap.com/poidetail?poiid=${poiid}&lat=${amap_location[0]}&lon=${amap_location[1]}&src=macuahike&callnative=1`;

  // return Linking.openURL(webUrl).catch(e => console.warn(e));
  url = webUrl;
  if (Platform.OS === 'android') {
    //android

    if (targetAppName === 'gaode') {
      url = `androidamap://uri.amap.com/poidetail?poiid=${poiid}&src=macuahike&callnative=1`;
      webUrl = webUrlGaode;
    }
  } else if (Platform.OS === 'ios') {
    //ios

    if (targetAppName === 'gaode') {
      url = `iosamap://uri.amap.com/poidetail?poiid=${poiid}&lat=${amap_location[0]}&lon=${amap_location[1]}&src=macuahike&callnative=1`;
      webUrl = webUrlGaode_ios;
    }
  }

  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        console.log("Can't handle url: " + url);
        console.log('webUrl open :', webUrl);
        return Linking.openURL(webUrl).catch(e => console.warn(e));
      } else {
        return Linking.openURL(url).catch(e => console.warn(e));
      }
    })
    .catch(err => console.error('An error occurred', err));
}

/**
 * 乘法精度问题
 * @param num1
 * @param num2
 * @returns {number}
 */
export function mul(num1, num2) {
  let m = 0,
    s1 = num1.toString(),
    s2 = num2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
}

export function div(a, b) {
  var c,
    d,
    e = 0,
    f = 0;
  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {}
  return (
    (c = Number(a.toString().replace('.', ''))),
    (d = Number(b.toString().replace('.', ''))),
    mul(c / d, Math.pow(10, f - e))
  );
}

export function add(a, b) {
  var c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}

export function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

export function localFilePath(path) {
  if (Platform.OS === 'android') return 'file://' + path;
  return path;
}

function getUserId() {
  if (
    !isEmptyObject(global.login_user) &&
    strNotNull(global.login_user.user_id)
  ) {
    return login_user.user_id;
  }
  return '0';
}

export function uShareLoad() {
  let param = {
    shareTitle: '【澳门旅行APP】下载后免费抽奖，最高可获得iPhone XS！',
    shareText:
      '在这里，可以随时随地找美食、定酒店！更有幸运大转盘——百万大奖等你拿！',
    shareImage: shareIcon,
    // shareLink: shareHost() + "invite_load?id=" + getUserId()
    shareLink: shareHost() + 'loadApp',
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareRegistered() {
  let param = {
    shareTitle: '【澳门旅行APP】下载后免费抽奖，最高可获得iPhone XS！',
    shareText:
      '在这里，可以随时随地找美食、定酒店！更有幸运大转盘——百万大奖等你拿！',
    shareImage: shareIcon,
    shareLink: shareHost() + 'invite_load?id=' + getUserId(),
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareMallInfo(title, desc, icon, id) {
  let param = {
    shareTitle: title,
    shareText: strNotNull(desc) ? desc : I18n.t('ads_poker'),
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'products/' + id,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareInfoItem(title, desc, icon, id) {
  let param = {
    shareTitle: title,
    shareText: strNotNull(desc) ? desc : I18n.t('ads_poker'),
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'infos/' + id,
    shareId: id,
    shareType: 'info',
    show_favorites: true,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

/**
 * 根据路径获取后缀名
 * @param filePath
 * @returns {string}
 */
export function getFileMine(filePath) {
  //获取最后一个.的位置
  let index = filePath.lastIndexOf('.');
  //获取后缀
  let ext = filePath.substr(index + 1);
  console.log(ext);
  return ext;
}

//计算日期之间的天数
export function DateDiff(sDate1, sDate2) {
  //sDate1和sDate2是2017-9-25格式
  sDate1 = convertDate(sDate1, 'D-MM-YYYY');
  sDate2 = convertDate(sDate2, 'D-MM-YYYY');
  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split('-');
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为9-25-2017格式
  aDate = sDate2.split('-');
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays;
}

export function isFollowed(user_id) {
  const followings = global.followships;
  if (_.isEmpty(followings)) return false;
  let follow = followings.filter(item => user_id === item);
  return follow.length === 1;
}

//获取实名信息
export function getVerId() {
  console.log('实名信息', global.verifies);
  const {chinese_ids, passport_ids} = global.verifies;
  let real_name = {};
  if (!isEmptyObject(chinese_ids) && chinese_ids.length > 0) {
    chinese_ids.forEach(item => {
      if (item.default) real_name = item;
    });
  } else if (!isEmptyObject(passport_ids) && passport_ids.length > 0) {
    passport_ids.forEach(item => {
      if (item.default) real_name = item;
    });
  }
  return real_name;
}

//取小数点俩位
export function toDecimal(x) {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 100) / 100;
  return f;
}

//根据路径获取文件名
export function getFileName(o) {
  logMsg('文件路径', o);
  let pos = o.lastIndexOf('/');
  return o.substring(pos + 1);
}

//App更新
export function updateApp(data) {
  const {android_platform, ios_platform} = data;
  console.log('更新提示', data);
  if (Platform.OS === 'ios') {
    if (Number.parseFloat(ios_platform.version) > Constants.UpdateVersion) {
      updateAlet(ios_platform);
    }
  } else {
    if (Number.parseFloat(android_platform.version) > Constants.UpdateVersion) {
      updateAlet(android_platform);
    }
  }
}

/*获取购物车*/
export function getCarts() {
  storage
    .load({key: StorageKey.ShoppingCarts})
    .then(ret => {
      console.log('shoppingCarts:', ret);
      global.shoppingCarts = ret;
    })
    .catch(err => {});
}

/*删除购物车*/
export function deleteProductFromCart(carts) {
  global.shoppingCarts = carts;
  storage.save({
    key: StorageKey.ShoppingCarts,
    data: carts,
  });
  getDispatchAction()['DELETE_CART']();
}

/*添加商品到购物车*/
export function pushProductToCart(product) {
  const {variant, number} = product;
  let hasContain = false;
  /*去重商品数量相加*/
  global.shoppingCarts.map(item => {
    if (variant.id === item.variant.id) {
      hasContain = true;
      item.number += number;
    }
    return item;
  });
  if (!hasContain) global.shoppingCarts.push(product);
  storage.save({
    key: StorageKey.ShoppingCarts,
    data: global.shoppingCarts,
  });
  getDispatchAction()['ADD_CART']();
}

export function logMsg(...msg) {
  if (__DEV__) console.log(...msg);
}

/*App更新提示*/
export function updateAlet(data) {
  console.log('更新提示弹框', data);
  let url = `${data.download_url}?version=${data.version}`;

  const upgrade = data.force_upgrade
    ? [
        {
          text: I18n.t('update_download'),
          onPress: () => {
            if (strNotNull(data.download_url)) {
              Linking.openURL(url);
            }
          },
        },
      ]
    : [
        {
          text: I18n.t('update_cancel'),
          onPress: () => {},
        },
        {
          text: I18n.t('update_download'),
          onPress: () => {
            if (strNotNull(data.download_url)) {
              Linking.openURL(url);
            }
          },
        },
      ];

  let content = `当前版本：${Constants.VERSION}  更新版本：${data.version}\n\n${data.content}`;
  Alert.alert(strNotNull(data.title) ? data.title : 'Alert', content, upgrade, {
    cancelable: false,
    onDismiss: () => {},
  });
}

export function strToDate(date) {
  let t = Date.parse(date);
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, '/')));
  } else {
    return new Date();
  }
}

const shareIcon = 'http://kkh5.deshpro.com/images/default_img.png';
export const DayHeadings = [
  I18n.t('calendar_7'),
  I18n.t('calendar_1'),
  I18n.t('calendar_2'),
  I18n.t('calendar_3'),
  I18n.t('calendar_4'),
  I18n.t('calendar_5'),
  I18n.t('calendar_6'),
];
export const MonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/*判断是否为Null*/
export function strNotNull(str) {
  if (str == undefined || str == null || str.length == 0) return false;
  else return true;
}

let Lang = 'zh';

export function setLang(lang) {
  Lang = lang;
  // console.log('分享页语言'+Lang);
}

/*时间 今天*/
export function getDayDiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();

  var diffValue = now - dateTimeStamp * 1000;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  let result = '';
  if (dayC < 1) {
    result = '' + I18n.t('today');
  } else if (dayC === 1) {
    result = '' + I18n.t('yesterday');
  } else if (dayC > 1) {
    result = '' + parseInt(monthC) + I18n.t('month') + parseInt(dayC);
  }
  return result;
}

export function formatCurrency(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = '0';
  let sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = '0' + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      ',' +
      num.substring(num.length - (4 * i + 3));
  return (sign ? '' : '-') + num + '.' + cents;
}

export function agoDynamicDate(dateTimeStamp) {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();

  let diffValue = now - dateTimeStamp * 1000;
  if (diffValue < 0) {
    return;
  }

  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  let result = '';
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + I18n.t('time_month');
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + I18n.t('time_week');
  } else if (0 <= dayC && dayC < 1) {
    result = I18n.t('today');
  } else if (1 <= dayC && dayC < 2) {
    result = I18n.t('yesterday');
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + I18n.t('time_day');
  } else result = moment.unix(dateTimeStamp).format('MMM Do YY');

  return result;
}

/*时间 1小时前*/
export function getDateDiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();

  var diffValue = now - dateTimeStamp * 1000;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  let result = '';
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + I18n.t('time_month');
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + I18n.t('time_week');
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + I18n.t('time_day');
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + I18n.t('time_hour');
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + I18n.t('time_min');
  } else result = I18n.t('time_moment');
  return result;
}

export function sharePage(title, location, icon, url) {
  let thumb = getShareIcon(icon);
  let param = {
    shareTitle: title,
    shareText: location,
    shareImage: thumb,
    shareLink: url,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function alipay(data, callback, cancelBack) {
  console.log('alipay', data);
  //   Alipay.pay(data).then(
  //     ret => {
  //       callback(ret);
  //     },
  //     err => {
  //       cancelBack(err);
  //     },
  //   );
}

export function payWx(data, callback, cancelBack) {
  const body = {
    partnerId: data.partnerid, // 商家向财付通申请的商家id
    prepayId: data.prepayid, // 预支付订单
    nonceStr: data.noncestr, // 随机串，防重发
    timeStamp: data.timestamp, // 时间戳，防重发
    package: data.package, // 商家根据财付通文档填写的数据和签名
    sign: data.sign,
  };

  console.log('wxpay', body);
  wechat
    .pay(body)
    .then(ret => {
      callback(ret);
    })
    .catch(err => {
      cancelBack(err);
    });
}

export function isWXAppInstalled(resolve) {
  return wechat
    .isWXAppInstalled()
    .then(data => {
      resolve(data);
    })
    .catch(err => {
      resolve(false);
    });
}

export function hotelOrderStatus(status) {
  switch (status) {
    case 'unpaid':
      return '待付款';
    case 'paid':
      return '待入住';
    case 'confirmed':
      return '已完成';
    case 'canceled':
      return '已取消';
    default:
      return '';
  }
}

/**
 * 微信登录
 * @param resolve
 * @param reject
 */
export function loginWX(resolve, reject) {
  wechat
    .sendAuthRequest('snsapi_userinfo', 'pokerpro')
    .then(data => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    });
}

export function shareTxt(msg) {
  return strNotNull(msg) ? msg : I18n.t('ads_poker');
}

export function uShareTicket(title, desc, icon, id, ticket_id) {
  let param = {
    shareTitle: title,
    shareText: shareTxt(desc),
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'races/' + id + '/tickets/' + ticket_id,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareChoiseTicket(name, location, time, logo, race_id) {
  let des = time + '\n' + location;
  let url = `${shareHost()}raceTickets/${race_id}/${Lang}?x=${new Date().getTime()}`;
  let param = {
    shareTitle: name,
    shareText: shareTxt(des),
    shareImage: getShareIcon(logo),
    shareLink: url,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareActivity(title, desc, icon, id) {
  let param = {
    shareTitle: title,
    shareText: shareTxt(desc),
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'activities/' + id,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uShareRace(title, location, icon, raceId) {
  let param = {
    shareTitle: title,
    shareText: location,
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'race/' + raceId,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function newShare(title, location, icon, newsId) {
  let thumb = getShareIcon(icon);
  let param = {
    shareTitle: title,
    shareText: location,
    shareImage: thumb,
    shareLink: shareHost() + 'news/' + newsId,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function rankPlayerShare(title, location, icon, playerId) {
  let param = {
    shareTitle: title,
    shareText: location,
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'rankPlayer/' + playerId,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function rankGameShare(title, location, icon, gameId) {
  let param = {
    shareTitle: title,
    shareText: location,
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'rankGame/' + gameId,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function uVideoShare(title, desc, icon, videoId) {
  let param = {
    shareTitle: title,
    shareText: shareTxt(desc),
    shareImage: getShareIcon(icon),
    shareLink: shareHost() + 'videos/' + videoId,
  };
  getDispatchAction()['SHARE_OPEN'](param);
}

export function getShareIcon(icon) {
  return strNotNull(icon) ? encodeURI(icon) : shareIcon;
}

export function strNull__(str) {
  if (strNotNull(str)) return str;
  else return '--';
}

export function strValid(str) {
  if (str === undefined || str === null || str.length === 0) return '';
  else return str;
}

export function getGetOrdinal(n) {
  let s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function strRow(str) {
  if (strValid(str)) {
    return str.replace('|', '\n');
  }
}

var pattern = / /;

export function nameRow(name) {
  if (strValid(name)) {
    return name.replace(pattern, ' ').replace(' ', '\n');
  }
}

/*日期数据*/
export function _createDateData() {
  let date = [];
  for (let i = 1950; i < 2050; i++) {
    let month = [];
    for (let j = 1; j < 13; j++) {
      let day = [];
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(k + '日');
        }
        //Leap day for years that are divisible by 4, such as 2000, 2004
        if (i % 4 === 0) {
          day.push(29 + '日');
        }
      } else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
        for (let k = 1; k < 32; k++) {
          day.push(k + '日');
        }
      } else {
        for (let k = 1; k < 31; k++) {
          day.push(k + '日');
        }
      }
      let _month = {};
      _month[j + '月'] = day;
      month.push(_month);
    }
    let _date = {};
    _date[i + '年'] = month;
    date.push(_date);
  }
  return date;
}

/*金额千分转换*/
export function moneyFormat(num) {
  var num = (num || 0).toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}

/*对象是否为空对象*/
export function isEmptyObject(e) {
  var t;
  for (t in e) return !1;
  return !0;
}

export function showToast(msg) {
  if (strNotNull(msg)) {
    const toast = Toast.show(msg, {
      testID: 'deshproToast',
      position: 200,
      duration: Toast.durations.SHORT,
      shadow: false,
      onHidden: siblingManager => {
        Toast.hide(toast);
      },
    });
  }
}

export function showWeek(week) {
  if (week === 'Monday') {
    return '周一';
  } else if (week === 'Tu') {
    return '周二';
  } else if (week === 'We') {
    return '周三';
  } else if (week === 'Th') {
    return '周四';
  } else if (week === 'Fr') {
    return '周五';
  } else if (week === 'Sa') {
    return '周六';
  } else if (week === 'Su') {
    return '周日';
  }
}

var myreg = /^\d{5,20}$/;

var myreg2 = /^1(3|4|5|7|8)\d{9}$/;

export function checkPhone(phone) {
  if (phone != null && phone != undefined) {
    if (!myreg.test(phone.trim())) {
      showToast(`${I18n.t('show_put_phone')}`);
      return false;
    }
    return true;
  }
}

export function checkPhone2(phone, ext) {
  if (!strNotNull(ext)) {
    showToast('请填写完整的信息');
  } else if (phone != null && phone != undefined) {
    if (!myreg.test(phone.trim())) {
      showToast(`${I18n.t('show_put_phone')}`);
      return false;
    }
    return true;
  }
}

var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export function checkMail(mail) {
  if (strNotNull(mail) && filter.test(mail.trim())) return true;
  else {
    showToast(`${I18n.t('show_mail_fail')}`);
    return false;
  }
}

export function checkLoginMail(mail) {
  if (filter.test(mail.trim())) return true;
  else {
    return false;
  }
}

/*有效的密码格式满足的条件
 1, 长度必须6 - 20位
 2, 必须是 数字+字母 或 数字 + 特殊字符 或 字母+特殊字符 或 数字 + 字母 + 特殊字符的组合*/
var PWD_VALID_FORMAT_REGEX = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;

export function pwdVaild(password) {
  if (PWD_VALID_FORMAT_REGEX.test(password)) return true;
  else {
    showToast(`${I18n.t('show_password_fail')}`);
    return false;
  }
}

export function md5Pwd(password) {
  return md5.hex_md5(password);
}

/*赛事状态*/
export function raceStatusConvert(status) {
  switch (status) {
    case 'unbegin':
      return I18n.t('races_unstart');
    case 'go_ahead':
      return I18n.t('donging');
    case 'ended':
      return I18n.t('ended');
    case 'closed':
      return I18n.t('closed');
  }
}

export function racesStatusImage(status) {
  switch (status) {
    case 'unbegin':
      return Images.home_unstart;
    case 'go_ahead':
      return Images.home_competition;
    case 'ended':
      return Images.home_over;
    case 'closed':
      return Images.home_over_one;
  }
}

/*票务状态*/
export function ticketStatusConvert(status) {
  switch (status) {
    case 'unsold':
      return I18n.t('ticket_unsold');
    case 'selling':
      return I18n.t('ticket_selling');
    case 'end':
      return I18n.t('ticket_end');
    case 'sold_out':
      return I18n.t('ticket_sold_out');
  }
}

export function sellable(status, sellable) {
  if (sellable) return status === SellStatus.selling;
  else return false;
}

/*日期转化*/
export function convertDate(date, formate) {
  if (strNotNull(date)) return moment(date).format(formate);
}

//UTC 时间转化
export function utcDate(utc, formate) {
  if (strNotNull(utc)) return moment.unix(utc).format(formate);
}

//得到时间的相关信息
export function dateString(date, formate) {
  if (strNotNull(date)) {
    let dateString = convertDate(date, 'YYYY-MM-DD');
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let timestamp = Date.parse(date) / 1000;
    let dates = {
      dateString: dateString,
      day: day,
      month: month,
      timestamp: timestamp,
      year: year,
    };
    console.log('nnnnnn:', dates);
    return dates;
  }
}

/*订单状态*/
export function orderStatus(status) {
  switch (legalValue(status)) {
    case 'unpaid':
      return I18n.t('unpaid');
    case 'paid':
      return I18n.t('unshipped');
    case 'completed':
      return I18n.t('completed');
    case 'canceled':
      return I18n.t('canceled');
    case 'delivered':
      return I18n.t('delivered');
  }
}

/*票务类型*/
export function ticketType(type) {
  switch (legalValue(type)) {
    case 'e_ticket':
      return I18n.t('ticket_web');
  }
}

/**/
export function legalValue(value) {
  return value ? value : '';
}

/*获取登陆用户*/
export function getLoginUser() {
  return LoginUser;
}

/*缓存登陆用户*/
export function putLoginUser(ret) {
  setLoginUser(ret);
  storage.save({
    key: StorageKey.UserAvatar,
    data: ret.avatar,
  });
}

/**
 * 收藏是否存在
 * @param target
 * @returns {boolean}
 */
export function isFavorite(target) {
  if (global.favorites && global.favorites.length > 0) {
    //收藏列表查找，通过类型和id
    let arr = global.favorites.filter(item => {
      if (
        item.target_type === target.target_type &&
        item.hasOwnProperty(`${target.target_type}`)
      ) {
        return item[`${target.target_type}`].id === target.target_id;
      }
      return false;
    });

    return arr.length > 0;
  }

  return false;
}

/*是否登陆*/
export function isLoginUser() {
  if (!isEmptyObject(LoginUser) && strNotNull(LoginUser.user_id)) return true;
  else return false;
}

/*清除登陆用户*/
export function clearLoginUser() {
  storage.remove({
    key: StorageKey.LoginUser,
  });
  removeToken();
  setLoginUser({});
  getDispatchAction()['CLEAR_PROFILE']();
  global.user_extra = {};
  global.addressList = [];
  JMessage.logout();
}

/*身份证验证状态*/
export function idCardStatus(status) {
  switch (status) {
    case Verified.PENDING:
      return I18n.t('pending');
    case Verified.PASSED:
      return I18n.t('passed');
    case Verified.FAILED:
      return I18n.t('failed');
  }
}

export function setUserData(username) {
  userData = username;
  storage.save({
    key: StorageKey.UserData,
    data: username,
  });
}

export var userData = '';

export function getUserData() {
  storage
    .load({key: StorageKey.UserData})
    .then(ret => {
      userData = ret;
    })
    .catch(err => {});
  storage
    .load({key: StorageKey.PayCountDown})
    .then(time => {
      console.log('payRecodes', time);
      global.timeRecodes = time;
    })
    .catch(err => {});
}

export let FontSize = {
  h19: 19,
  h18: 18,
  h17: 17,
  h16: 16,
  h15: 15,
  h14: 14,
  h13: 13,
  h12: 12,
  h9: 9,
};
let sizeNum = 0;

export function getSize() {
  storage
    .load({key: StorageKey.FontNum})
    .then(ret => {
      sizeNum = ret;
      console.log('sizeNum:' + sizeNum);
      FontSize = {
        h19: 19 + sizeNum,
        h18: 18 + sizeNum,
        h17: 17 + sizeNum,
        h16: 16 + sizeNum,
        h15: 15 + sizeNum,
        h14: 14 + sizeNum,
        h13: 13 + sizeNum,
        h12: 12 + sizeNum,
        h9: 9 + sizeNum,
      };
    })
    .catch(err => {});
}

export function setSize(num) {
  sizeNum = num;
  FontSize = {
    h19: 19 + sizeNum,
    h18: 18 + sizeNum,
    h17: 17 + sizeNum,
    h16: 16 + sizeNum,
    h15: 15 + sizeNum,
    h14: 14 + sizeNum,
    h13: 13 + sizeNum,
    h12: 12 + sizeNum,
    h9: 9 + sizeNum,
  };
  storage.save({
    key: StorageKey.FontNum,
    data: num,
  });
}

export function setFontSize(num) {
  storage.save({
    key: StorageKey.FontSizeNum,
    data: num,
  });
}

/*数组格式 转 字典数组*/
export function dataBlob(arr) {
  var objArr = {}; //定义一个空对象
  var len = arr.length;

  for (var i = 0; i < len; i++) {
    var begin_date = convertDate(arr[i].begin_date, YYYY_MM);
    var Value = arr[i];

    if (!objArr[begin_date]) {
      //objArr[Id]未定义或不存在
      objArr[begin_date] = [];
    }

    objArr[begin_date].push(Value);
  }

  return objArr;
}

/*月份增加*/
export function getCurrentMonth() {
  return moment().format(YYYY_MM);
}

export function getCurrentDate() {
  return moment();
}

/*数组去重*/
export function arrayUnique(arr) {
  var n = {},
    r = []; //n为hash表，r为临时数组
  for (
    var i = 0;
    i < arr.length;
    i++ //遍历当前数组
  ) {
    var race_id = arr[i].race_id;
    if (!n[race_id]) {
      //如果hash表中没有当前项
      n[race_id] = true; //存入hash表
      r.push(arr[i]); //把当前数组的当前项push到临时数组里面
    }
  }
  return r;
}

export function newsUnique(arr) {
  var n = {},
    r = []; //n为hash表，r为临时数组
  for (
    var i = 0;
    i < arr.length;
    i++ //遍历当前数组
  ) {
    var id = arr[i].id;
    if (!n[id]) {
      //如果hash表中没有当前项
      n[id] = true; //存入hash表
      r.push(arr[i]); //把当前数组的当前项push到临时数组里面
    }
  }
  return r;
}

export function uniqueArray(arr, items) {
  arr.concat(items);
  let n = {},
    r = [];
  for (let i = 0; i < arr.length; i++) {
    let id = arr[i].id;
    if (!n[id]) {
      //如果hash表中没有当前项
      n[id] = true;
    } else {
      r.push(arr[i]); //把当前数组的当前项push到临时数组里面
    }
  }

  items.concat(r);
  let m = {},
    l = [];
  for (let j = 0; j < items.length; j++) {
    let id = items[j].id;
    if (!m[id]) {
      //如果hash表中没有当前项
      m[id] = true; //存入hash表
      l.push(items[j]); //把当前数组的当前项push到临时数组里面
    }
  }

  console.log(l);

  return l;
}

/*拨打电话*/
export function call(phone) {
  Communications.phonecall(phone, false);
}

/*屏幕像素密度*/
export function pixel(layout) {
  return PixelRatio.getPixelSizeForLayoutSize(layout);
}

var Actions = {};

/*Action 方法*/
export function setDispatchAction(key, func) {
  Actions[key] = func;
}

export function getDispatchAction() {
  return Actions;
}

//正在开发提示
export function alertOrder(str, callback) {
  Alert.alert(str, '', [
    {
      text: `${I18n.t('cancel')}`,
      onPress: () => {},
    },
    {
      text: `${I18n.t('confirm')}`,
      onPress: () => {
        callback();
      },
    },
  ]);
}

//中奖提示
export function alertLotteryOrder(str, str2, callback) {
  Alert.alert(str, str2, [
    {
      text: `知道了`,
      onPress: () => {},
    },
    {
      text: `前往领奖`,
      onPress: () => {
        callback();
      },
    },
  ]);
}

export function permissionAlert(message) {
  Alert.alert('权限提示', message, [
    {text: '取消'},
    {
      text: '设置',
      onPress: () => {
        Linking.openURL('app-settings:').catch(err =>
          console.log('error', err),
        );
      },
    },
  ]);
}

//微信提示
export function alertOrderChat(str) {
  Alert.alert(str);
}

//正在开发提示
export function alertRefresh(callback) {
  Alert.alert(`${I18n.t('tint')}`, `${I18n.t('load_err')}`, [
    {
      text: `${I18n.t('cancel')}`,
      onPress: () => {},
    },
    {
      text: `${I18n.t('retry')}`,
      onPress: () => {
        callback();
      },
    },
  ]);
}

//获取单月的最后一个天
export function getMonthLastDay(firstDate) {
  let endDate = new Date(firstDate);
  endDate.setMonth(endDate.getMonth() + 1);

  endDate.setDate(0);

  return moment(endDate).format('YYYY-MM-DD');
}

//分享工具
export function share(content, url) {
  Share.share({
    message: url,
    url: url,
    title: content,
  })
    .then(_showResult)
    .catch(error => {});
}

function _showResult(result) {
  if (result.action === Share.sharedAction) {
    // showToast('分享成功');
  }
}

//判断奇偶数
export function singleOrdouble(num) {
  if (num % 2 === 0) return true;
  else return false;
}

export function checkMobile(mobileStr) {
  if (!mobileStr) {
    showToast('手机号格式不对');
    return false;
  }
  // let re = /^((13[0-9])|(14[0-9])|(15[^4])|(16[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
  let re = /^\d{8,16}$/;
  if (re.test(mobileStr)) {
    return true;
  } else {
    showToast('手机号格式不对');
    return false;
  }
}

export function checkZip(zip) {
  if (!zip) {
    showToast('邮编格式不对');
    return false;
  }
  let re = /^\d{6}$/;
  if (re.test(zip)) {
    return true;
  } else {
    showToast('邮编格式不对');
    return false;
  }
}

let reg = /^[0-9]+$/;

export function checkPriceLength(price) {
  if (reg.test(price)) {
    if (price < 1000) {
      return 40;
    } else if (price >= 1000 && price < 10000) {
      return 35;
    } else if (price >= 10000 && price < 100000) {
      return 28;
    } else {
      return 18;
    }
  }
}

//计算数组中的最大值
export function getMax(items, total_price) {
  let max = items[0];
  for (let i = 1; i < items.length; i++) {
    if (getDiscount(items[i], total_price) < getDiscount(max, total_price)) {
      max = items[i];
    }
  }
  return max;
}

export function getDiscount(item, total_price) {
  if (item.discount_type === 'rebate') {
    console.log(
      'rebate',
      mul(Number.parseFloat(item.discount), Number.parseFloat(total_price)),
    );
    return mul(
      Number.parseFloat(item.discount),
      Number.parseFloat(total_price),
    );
  } else {
    console.log('reduce', Number.parseFloat(item.reduce_price));
    return (
      Number.parseFloat(total_price) - Number.parseFloat(item.reduce_price)
    );
  }
}
