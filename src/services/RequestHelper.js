/**
 * Created by lorne on 2016/12/23.
 */
import {create, SERVER_ERROR, TIMEOUT_ERROR, NETWORK_ERROR} from 'apisauce';
import Api from '../configs/ApiConfig';
import {clearLoginUser, showToast, strNotNull, permissionAlert, logMsg} from '../utils/ComonHelper';
import StorageKey from '../configs/StorageKey';
import I18n from '../I18n/I18n';
import {NetInfo} from 'react-native'


let TAG = 'PuKeHttp:';


// define the api
const client = create({
    baseURL: Api.production,
    timeout: 30000,
    // headers: {
    //     'X-DP-APP-KEY': '467109f4b44be6398c17f6c058dfa7ee',
    //     'X-DP-CLIENT-IP': '192.168.2.231'
    // },
});

export function setDpLang(lang) {
    client.setHeader('X-DP-LANG', 'zh')
}

export function getDpLang() {
    return client.headers['X-DP-LANG'];
}

export function getApiType() {
    let type = 'production';
    let ret = client.getBaseURL();

    if (ret === Api.dev)
        type = 'dev';
    else if (ret === Api.test)
        type = 'test';
    else if (ret === Api.production)
        type = 'production';

    return type;
}


export function getBaseURL(callback) {
    storage.load({
        key: StorageKey.ApiSever,
        autoSync: true,
        syncInBackground: false
    })
        .then((ret) => {
            client.setBaseURL(ret);
            callback();
        }).catch(err => {
        logMsg("catch", err)
        client.setBaseURL(Api.production);
        setBaseURL(Api.production);
        callback();
    });
}

export function setBaseURL(api) {
    client.setBaseURL(api);
    storage.save({
        key: StorageKey.ApiSever,
        data: api
    });

}

export function setAccessToken(token) {
    client.setHeader('x-access-token', token)
}

export function getAccessToken() {
    let token = client.headers['x-access-token'];

    return strNotNull(token) ? token : '';
}

export function removeToken() {
    delete client.headers['x-access-token']
}


if (__DEV__) {

    const naviMonitor = (response) => {
        const {config} = response;
        console.log('RES_URL:' + config.url, response)
    }
    client.addMonitor(naviMonitor);
    client.addRequestTransform(request => {
        console.log('URL:' + client.getBaseURL() + request.url, request)
    })
}


export function post(url, body, resolve, reject) {

    console.log(url, body)
    client.post(url, body)
        .then((response) => {
            handle(response, resolve, reject)


        }).catch((error) => {
        console.log(TAG, error);

        reject('Network response was not ok.');
    });
}


export function del(url, body, resolve, reject) {
    console.log(url, body);
    client.delete(url, body)
        .then((response) => {
            handle(response, resolve, reject)

        }).catch((error) => {

        console.log(TAG, error);
        reject('Network response was not ok.');
    });
}


export function put(url, body, resolve, reject) {
    console.log(url, body)
    client.put(url, body)
        .then((response) => {
            handle(response, resolve, reject)

        }).catch((error) => {
        console.log(TAG, error);
        reject('Network response was not ok.');
    });
}

export function get(url, resolve, reject, params = {}) {
    console.log(url)
    const isKkapiUrl = params.isKkapiUrl
    delete params.isKkapiUrl;

    client.get(url, params)
        .then((response) => {
            handle(response, resolve, reject, isKkapiUrl)

        }).catch((error) => {

        console.log(TAG, error);
        reject('Network response was not ok.');
    });
}

let netCount = 0

/*token过期*/
function netError(response, reject) {
    try {
        logMsg('错误信息', response)
        let msgErr = '';
        if (response.status === 401) {
            clearLoginUser();
            router.popToLoginFirstPage();
            msgErr = response.data.message;
        }

        if (response.problem === SERVER_ERROR)
            msgErr = I18n.t('SERVER_ERROR');
        else if (response.problem === TIMEOUT_ERROR)
            msgErr = I18n.t('TIMEOUT_ERROR');
        else if (response.problem === "CLIENT_ERROR") {
            // netinfo(netCount++)
            reject && reject(response)
            return
        }

        if (strNotNull(msgErr)) {
            showToast(msgErr);
            reject && reject(msgErr);
        }

    } catch (e) {
        logMsg(e)
    }

}


function netinfo(count) {
    logMsg('网络问题次数', count)
    if (count > 4) {
        netCount = 0;
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
            if (connectionInfo.type === 'unknown' || connectionInfo.type === 'none') {
                permissionAlert('澳门旅行网络权限已被关闭或当前网路不可用')
            }
        });
    } else {
        showToast('网路加载慢，请稍后再试！')
    }

}

function handle(response, resolve, reject, isKkapiUrl = true) {
    try {
        if (response.ok) {
            if (!isKkapiUrl) return resolve(response.data);

            const {code, msg} = response.data;
            if (code === 0) {
                resolve(response.data);
            } else {
                msg && showToast(msg)
                reject && reject(msg);
            }
        } else {

            netError(response, reject);
        }
    } catch (e) {
        logMsg(e)
    }

}



