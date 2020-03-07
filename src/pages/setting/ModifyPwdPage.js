/**
 * Created by lorne on 2017/3/1.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput, Alert,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar, SetInputView, Button} from '../../components';
import {strNotNull, md5Pwd, showToast, pwdVaild} from '../../utils/ComonHelper';
import {postChangePwd} from '../../services/AccountDao'


export default class ModifyPwdPage extends Component {

    state = {
        oldPwd: '',
        newPwd: ''
    };


    render() {
        return (<View
                testID="page_modify_pwd_by_pwd"
                style={ApplicationStyles.bg_black}>
                <NavigationBar
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={I18n.t('modify')}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <View style={{height: 5}}/>

                <SetInputView
                    textChange={text => {
                        this.setState({
                            oldPwd: text
                        })
                    }}
                    security={true}
                    placeholder={I18n.t('old_pwd')}
                    inputTestID="input_old_pwd"
                    clearTestID="btn_old_input_clear"
                    eyeTestID="btn_old_eye"/>

                <View style={{height: 1}}/>
                <SetInputView
                    textChange={text => {
                        this.setState({
                            newPwd: text
                        })
                    }}
                    security={true}
                    placeholder={I18n.t('new_password')}
                    inputTestID="input_new_pwd"
                    clearTestID="btn_new_input_clear"
                    eyeTestID="btn_new_eye"/>


                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this._certain}
                    style={{
                        height: 50,
                        marginRight: 17,
                        marginLeft: 17,
                        backgroundColor: Colors._E54,
                        justifyContent: 'center',
                        marginTop: 60,
                        borderRadius: 4,
                        alignItems: 'center',

                    }}>
                    <Text style={{fontSize: 17, color: Colors._FFF}}>{I18n.t('certain')}</Text>
                </TouchableOpacity>

            </View>
        )
    }

    _certain = () => {
        const {oldPwd, newPwd} = this.state;
        if (strNotNull(oldPwd) && strNotNull(newPwd)) {
            const body = {
                old_pwd: md5Pwd(oldPwd),
                new_pwd: md5Pwd(newPwd),
                type: 'pwd'
            };

            postChangePwd(body, ret => {
                showToast(`密码修改成功`)
                router.popToTop()
            }, err => {
                showToast(`密码修改失败`)
            });
        } else {
            showToast(`${I18n.t('fillWhole')}`)
        }


    }
}

