/**
 * Created by lorne on 2016/12/26.
 */
import * as helper from './RequestHelper';
import Api from '../configs/ApiConfig';
import StorageKey from '../configs/StorageKey';
import JpushHelp from './JpushHelper';
import {isEmptyObject, logMsg, showToast} from '../utils/ComonHelper';
import {getAddressList} from './OrderDao';
import JMessage from 'jmessage-react-plugin';
import {followships, postNearBys} from './SocialDao';
import {getFavoritesList} from "./MacauDao";

// let image = require("../../source/home/home_avatar.png")


export function postShareCount(body, resolve, reject) {
    helper.post(Api.share_count(body), body, ret => {
        resolve(ret.data)
    }, err => {
        showToast(err);
        reject(err)
    })
}

export function report_templates() {
    // helper.get(Api.report_templates, ret => {
    //     global.reportList = ret.data;
    // }, err => {
    // })
}

export function postWheelTimes(body,resolve, reject) {
    helper.post(Api.post_wheel_times(), body, ret => {
        resolve(ret.data)
    }, reject)
}

export function postLottery(body,resolve, reject) {
    helper.post(Api.lottery(), body, ret => {
        resolve(ret.data)
    }, reject)
}

export function getPrizes_info(body,resolve, reject) {
    helper.get(Api.prizes_info(body), ret => {
        resolve(ret.data);
    },  reject)
}

export function getPrizesList(body,resolve, reject) {
    helper.get(Api.prizes_list(), ret => {
        resolve(ret.data);
    },  err => {
        reject(err)
    },body)
}

export function getLocation_ios(body,resolve, reject) {
    helper.get(Api.location_ios(body), ret => {
        resolve(ret);
    }, reject, {isKkapiUrl: false})
}

export function getTaskCount(resolve, reject) {
    helper.get(Api.task_count(), ret => {
        resolve(ret.data);
    }, reject)
}

export function getprizeMessages(resolve, reject) {
    helper.get(Api.prize_messages(), ret => {
        resolve(ret.data);
    }, reject)
}

export function getWheelTime(resolve, reject) {
    helper.get(Api.wheel_time(), ret => {
        resolve(ret.data);
    }, reject)
}

export function getElements(resolve, reject) {
    helper.get(Api.elements(), ret => {
        resolve(ret.data);
    },reject)
}

export function getContacts(resolve, reject) {
    helper.get(Api.contacts, ret => {
        resolve(ret.data);
    }, reject)
}

export function releases_show(resolve, reject) {
    helper.get(Api.releases_show, ret => {
        resolve(ret.data);
    },reject)
}

export function getPreferential(body, resolve, reject) {
    helper.get(Api.preferential(body), ret => {
        resolve(ret.data);
    }, err => {
        reject(err)
    })
}

export function getIsTestUser(resolve, reject) {
    helper.get(Api.test_user, ret => {
        resolve(ret.data);
    }, err => {
        reject(err)
    })
}

export function listVerified(resolve, reject) {
    helper.get(Api.list_certification(), ret => {
        resolve(ret.data);
        global.verifies = ret.data.items;
    }, err => {
        showToast(err);
        reject(err)
    })
}

export function defaultVerified(body, resolve, reject) {
    helper.post(Api.cert_default(body), body, ret => {
        resolve(ret.data)
    }, err => {
        showToast(err);
        reject(err)
    })
}

export function delVerified(body, resolve, reject) {
    helper.del(Api.add_certification + `/${body.id}`, body, ret => {
        resolve(ret.data)
    }, err => {
        showToast(err);
        reject(err)
    })
}


export function editVerified(id, body, resolve, reject) {
    helper.put(Api.add_certification + `/${id}`, body, ret => {
        resolve(ret.data)
    }, err => {
        showToast(err);
        reject(err)
    })
}

export function addVerified(body, resolve, reject) {
    helper.post(Api.add_certification, body, ret => {
        resolve(ret.data)
    }, err => {
        showToast(err);
        reject(err)
    })
}

export function getMsgUnRead(resolve, reject) {
    // helper.get(Api.unread_remind(), ret => {
    //     resolve(ret.data)
    // }, reject)
}


export function getUpdate(resolve, reject) {
    helper.get(Api.app_versions, ret => {
        resolve(ret.data)
    }, reject)
}


export function postMsgRead(body, resolve, reject) {
    helper.post(Api.msg_read(body), {}, ret => {
        resolve(ret.data)
    }, err => {
        reject(err);
        showToast(err)
    })
}

export function getActivityPush(resolve, reject) {
    // helper.get(Api.activityPush, ret => {
    //     resolve(ret.data)
    // }, reject)
}

export function getActivityInfo(body, resolve, reject) {
    helper.get(Api.activityInfo(body), ret => {
        resolve(ret.data)
    }, reject)
}

export function getActivities(body,resolve, reject) {
    helper.get(Api.activities, ret => {
        resolve(ret.data)
    }, reject,body)
}

export function getAccountExit(body, resolve, reject) {
    helper.get(Api.account_exist(), (ret) => {
        resolve(ret.data);
    }, err => {
        showToast(err);
        reject(err);
    }, body);
}


export function postWxAuth(body, resolve, reject) {
    helper.post(Api.weixin_auth, body, ret => {
        let {type, info} = ret.data;
        if (type === 'login') {
            setLoginData(info)
        }
        resolve(ret.data)
    }, err => {
        reject(err);
        showToast(err)
    })
}

export function postWxBind(body, resolve, reject) {
    helper.post(Api.weixin_bind, body, ret => {
        setLoginData(ret.data);
        resolve(ret.data)
    }, err => {
        reject(err);
        showToast(err)
    })
}

function setLoginData(login) {
    const {access_token} = login;
    setLoginUser(login);
    helper.setAccessToken(access_token);

}

export function postSuggest(body, resolve, reject) {
    helper.post(Api.feedbacks, body, data => {
        resolve(data)
    }, err => {
        reject(err)
        showToast(err)
    })
}

export function postLoginCount() {
    helper.post(Api.login_count(), {}, ret => {
    }, err => {
    })
}

export function delNotification(body, resolve, reject) {
    helper.del(Api.delNotice(body), {}, (ret) => {
        resolve(ret.data);
    }, reject);
}

export function getNotifications(resolve, reject) {
    helper.get(Api.notifications(), (ret) => {
        resolve(ret.data);
    }, reject);
}

export function postChangePermission(body, resolve, reject) {
    helper.post(Api.change_permission(), body, (ret) => {
        resolve(ret.data);
    }, reject);
}

export function postBindAccount(body, resolve, reject) {
    helper.post(Api.bind_account(), body, (ret) => {
        resolve(ret.data);
    }, reject);
}

export function postChangeBind(body, resolve, reject) {
    helper.post(Api.account_change_bind(), body, (ret) => {
        resolve(ret.data);
    }, reject);
}

export function playerInfo(body, resolve, reject) {
    helper.get(Api.player_info(body), (ret) => {
        resolve(ret.data);
    }, reject);
}


export function postVCode(body, resolve, reject) {
    helper.post(Api.v_codes, body, (ret) => {
        resolve(ret.data);
    }, reject);
}

/*注册*/
export function postRegister(body, resolve, reject) {
    logMsg('注册参数', body)

    helper.post(Api.register, body, (ret) => {
        setLoginData(ret.data);

        resolve(ret.data);
    }, reject);
}

/*登陆*/
export function postLogin(body, resolve, reject) {
    helper.post(Api.login, body, (ret) => {
        setLoginData(ret.data);

        resolve(ret);
    }, reject);
}

export var LoginUser = {};

export function getJmessageInfo(callback) {
    ///获取极光登录信息
    helper.post(Api.jmessage_info(), {}, (ret) => {

        ///登录极光
        JmessageLogin(ret.data, 5, callback)
    }, (err) => {
        console.log("获取极光IM用户名和密码失败:", err);
    });
}


function JmessageLogin(imUser, count, callback) {

    if (count > 0) {

        JMessage.login({
                username: imUser.username,
                password: imUser.password,
            },
            //登录成功回调
            () => {
                global.imUser = imUser;
                console.log("极光IM登录成功");
                callback && callback()
            },
            //登录失败回调
            (error) => {
                console.log("极光IM登录失败" + count, error);
                JmessageLogin(imUser, --count, callback)
            }
        );
    }

}

export function setLoginUser(ret) {
    LoginUser = ret;
    global.login_user = ret;

    storage.save({
        key: StorageKey.LoginUser,
        data: ret
    });


    if (!isEmptyObject(ret)) {
        setTimeout(() => {
            //获取实名信息
            listVerified(data => {
            }, err => {
            });


            //获取收货地址
            getAddressList(data => {
            });

            //统计登陆用户
            postLoginCount();

            //获取极光用户信息
            getJmessageInfo();

            //获取举报模板
            report_templates();

            //获取关注及粉丝列表
            followships(data => {
            }, err => {
            })

            //上传用户位置
            postLocation();

            //用户收藏
            getFavoritesList({},data=>{
                logMsg('用户收藏',global.favorites)
            },err=>{})

        }, 100);


        //Jpush别名设置
        JpushHelp.getRegistrationID((id) => {
            logMsg('JpushId: ' + id)
        });
        let type = helper.getApiType() === 'production' ? 'pro' : helper.getApiType();
        let alias = type + '_' + ret.user_id;
        logMsg('jpush',alias);
        JpushHelp.setAlias(alias, (ret) => {
            logMsg(ret ,' set jpush alias')
        })
    }else{
        JpushHelp.stopPush()
    }

}


function postLocation() {
    // setTimeout(() => {
    //     navigator.geolocation.getCurrentPosition(data => {
    //         const {coords} = data;
    //         if (!isEmptyObject(coords) && !isEmptyObject(global.login_user)) {
    //             const {longitude, latitude} = coords;
    //             postNearBys({lat: latitude, lng: longitude}, ret => {
    //             }, err => {
    //                 logMsg('位置',err)
    //             })
    //         }

    //     }, err => {
    //         console.log(err)
    //     })
    // }, 3000)

}

export function removeToken() {
    helper.removeToken();
}

export function localLoginUser(resolve, reject) {
    storage.load({key: StorageKey.LoginUser})
        .then(ret => {
            resolve(ret)
        }).catch(err => {
        reject(err)
    });
}

/*修改个人资料*/
export function putProfile(user_id, body, resolve, reject) {
    helper.put(Api.account_profile(user_id), body, (ret) => {
        storage.save({
            key: StorageKey.profile,
            data: ret.data
        });
        resolve(ret.data);
    }, reject);
}

/*获取个人资料*/
export function getProfile(user_id, resolve, reject) {
    helper.get(Api.account_profile(user_id), (ret) => {
        storage.save({
            key: StorageKey.profile,
            data: ret.data
        });
        resolve(ret.data);
    }, reject);
}

/*上传头像*/
export function postAvatar(body, resolve, reject) {
    helper.put(Api.upload_avatar(), body, (ret) => {
        resolve(ret.data)
    }, reject);
}


/*检验验证码是否正确*/
export function postVerifyCode(body, resolve, reject) {
    helper.post(Api.account_verify, body, resolve, reject);
}

/*找回密码*/
export function postResetPwdCode(body, resolve, reject) {
    helper.post(Api.account_reset_password, body, resolve, reject);
}

export function postChangePwd(body, resolve, reject) {
    helper.post(Api.account_change_pwd(), body, resolve, reject);
}

/*实名认证*/
export function postCertification(user_uuid, body, resolve, reject) {
    helper.post(Api.certification(user_uuid), body, resolve, reject);
}

/*获取实名认证*/
export function getCertification(user_uuid, resolve, reject) {
    helper.get(Api.certification(user_uuid), resolve, reject);
}

/*上传头像*/
export function postCardImage(body, resolve, reject) {
    helper.post(Api.upload_card_image, body, (ret) => {
        resolve(ret.data)
    }, reject);
}

// 上传护照
export function postPasswordImage(body, resolve, reject) {
    helper.post(Api.upload_card_image, body, (ret) => {
        resolve(ret.data)
    }, reject);
}