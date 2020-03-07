import * as helper from './RequestHelper';
import Api from '../configs/ApiConfig';
import {showToast} from "../utils/ComonHelper";

export function postWithdrawal(body, resolve, reject) {
    helper.post(Api.withdrawal, body, data => {
        resolve(data)
    }, err => {
        reject(err)
        showToast(err)
    })
}

export function novice_task(body, resolve, reject) {
    helper.get(Api.novice_task(), ret => {
        resolve(ret.data)
    }, reject, body)
}

export function other_invite(body, resolve, reject) {
    helper.get(Api.other_invite, ret => {
        resolve(ret.data)
    }, reject, body)
}

export function user_invite(body,resolve, reject) {
    helper.get(Api.user_invite, ret => {
        resolve(ret.data)
    }, reject,body)
}

export function invite_count(resolve, reject) {
    helper.get(Api.invite_count, ret => {
        resolve(ret.data)
    }, reject)
}

export function award_details(body,resolve, reject) {
    helper.get(Api.award_details, ret => {
        resolve(ret.data)
    }, reject,body)
}

export function wallet_account(resolve, reject) {
    helper.get(Api.wallet_account, ret => {
        resolve(ret.data)
    }, reject)
}

export function account_details(body,resolve, reject) {
    helper.get(Api.account_details, ret => {
        resolve(ret.data)
    }, reject,body)
}

export function display_check(resolve, reject) {
    helper.get(Api.display_check, ret => {
        resolve(ret.data)
    }, err => {
        reject(err)
    })
}

