import * as helper from './RequestHelper';
import Api from '../configs/ApiConfig';


export function postExchangeCoupon(body, resolve, reject) {
    helper.post(Api.exchange_coupon(body), {}, ret => {
        resolve(ret.data)
    }, reject, body)
}


export function getIntegralInfo(body,resolve, reject) {
    helper.get(Api.integral_info(body), ret => {
        resolve(ret.data);
    }, err => {
        reject(err)
    })
}

export function getIntrgralCoupon(body,resolve, reject) {
    helper.get(Api.integral_coupon(body), ret => {
        resolve(ret.data);
    }, err => {
        reject(err)
    })
}

export function getIntrgralMall(resolve, reject,params) {
    helper.get(Api.integral_mall, ret => {
        resolve(ret.data);
    }, err => {
        reject(err)
    },params)
}

export function postAward(body, resolve, reject) {
    helper.post(Api.integral_award(), body, ret => {
        resolve(ret.data)
    }, reject, body)
}
export function postIntegralTask(body, resolve, reject) {
    helper.post(Api.integral_task(body), {}, ret => {
        resolve(ret.data)
    }, reject, body)
}

export function postIntegralDetails(body, resolve, reject) {
    helper.get(Api.integral_detail(), ret => {
        resolve(ret.data)
    }, reject,body)
}
