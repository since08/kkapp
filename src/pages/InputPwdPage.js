/**
 * Created by lorne on 2016/12/29.
 */
import React, {Component} from 'react';
import {Text, TouchableOpacity, View, TextInput, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {Colors, Fonts, Images, Metrics} from '../Themes';
import I18n from '../I18n/I18n';
import md5 from "react-native-md5";
import {
    fetchPostEmailResetPwd, fetchPostMobileResetPwd,
    fetchPostEmailRegister, fetchPostMobileRegister
} from '../actions/AccountAction';
import {POST_REGISTER, POST_RESET_PASSWORD} from '../actions/ActionTypes';
import {pwdVaild} from '../utils/LoginHelper';
import NavigationBar from '../components/NavigationBar';
import {fetchGetProfile} from '../actions/PersonAction';
import {fetchGetRecentRaces} from '../actions/RacesAction';
import {closeDrawer} from '../reducers/DrawerRedux';
import {postRegister, postResetPwdCode} from '../services/AccountDao';
import {logMsg, showToast} from "../utils/ComonHelper";


class InputPwdPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile: props.params.phone,
            code: props.params.code,
            email: props.params.email,
            password: '',
            isRegisterOrForget: props.params.isRegisterOrForget,
            isEmailOrMobile: props.params.isEmailOrMobile,
            pwdEye: true,
            ext:props.params.ext
        }

        logMsg(this.state)
    }

    _toHome = (loginUser) => {
        const {user_id} = loginUser;
        this.props._getProfile(user_id);

        router.popToTop();
    };


    _request_register = () => {
        const {mobile, code, email, isEmailOrMobile, isRegisterOrForget, password,ext} = this.state;
        if (!pwdVaild(password)) {
            return;
        }
        let pwd = md5.hex_md5(password);

        if (isRegisterOrForget === 'register') {
            const body = {
                vcode: code,
                password: pwd
            };

            if (isEmailOrMobile === 'email') {
                body.type = 'email';
                body.email = email;
            } else if (isEmailOrMobile === 'mobile') {
                body.type = 'mobile';
                body.mobile = mobile;
                body.ext = ext;
            }

            postRegister(body, data => {
                this._toHome(data);
            }, err => {
                showToast(err)
            })
        } else if (isRegisterOrForget === 'forget') {
            const body = {
                vcode: code,
                password: pwd
            };
            if (isEmailOrMobile === 'email') {
                body.type = 'email';
                body.email = email;


            } else if (isEmailOrMobile === 'mobile') {
                body.type = 'mobile';
                body.mobile = mobile;
                body.ext = ext;
            }
            postResetPwdCode(body, data => {
                router.popToLogin()
            }, err => {
                showToast(err)
            })
        }


    };


    render() {

        const {pwdEye} = this.state;
        return (

            <View
                testID="page_input_password"
                style={{flex: 1, backgroundColor: Colors.bg_f5}}>
                <TouchableOpacity
                    testID="btn_home_page"
                    onPress={() => router.popToTop()}/>
                <View style={{backgroundColor: Colors._E54}}>
                    <NavigationBar
                        title={I18n.t('input_pwd')}
                        leftBtnIcon={Images.sign_return}
                        leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => router.pop()}/>
                </View>

                <View style={styles.input_view}>
                    <TextInput
                        testID="input_password"
                        style={styles.input}
                        placeholderTextColor={Colors._BBBB}
                        underlineColorAndroid='transparent'
                        onChangeText={text => {
                            this.setState({
                                password: text,
                            })
                        }}
                        secureTextEntry={pwdEye}
                        placeholder={I18n.t('ple_new_pwd')}/>


                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                pwdEye: !pwdEye
                            })
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50, width: 50
                        }}>

                        <Image
                            style={{
                                width: 18, height: 10
                            }}
                            source={pwdEye ? Images.sign_eye : Images.sign_eye_open}/>


                    </TouchableOpacity>
                </View>
                <Text style={{
                    marginTop: 20, alignSelf: 'center',
                    color: Colors._AAA, fontSize: 12
                }}>{I18n.t('password_format')}</Text>

                <TouchableOpacity
                    activeOpacity={1}
                    testID="btn_complete"
                    style={{
                        marginTop: 35, alignSelf: 'center',
                        backgroundColor: Colors._E54,
                        height: 45,
                        justifyContent: 'center',
                        borderRadius: 5,
                        width: 336
                    }}
                    onPress={this._request_register}>
                    <Text style={{
                        alignSelf: 'center',
                        color: Colors.white,
                        fontSize: 19
                    }}>{I18n.t('complete')}</Text>
                </TouchableOpacity>
            </View>


        )
    }
}

const styles = StyleSheet.create({

    input_view: {
        borderBottomColor: Colors._E5E5,
        borderBottomWidth: 1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        width: Metrics.screenWidth
    },
    input: {
        height: 50,
        color: Colors.txt_666,
        fontSize: 15, flex: 1, alignSelf: 'center',
        marginLeft: 20
    },

});

function bindAction(dispatch) {
    return {
        _registerByMobile: (mobile, vcode, password,ext) => dispatch(fetchPostMobileRegister(mobile, vcode, password,ext)),
        _registerByEmail: (email, password) => dispatch(fetchPostEmailRegister(email, password)),
        _resetPwdEmail: (email, vcode, password) => dispatch(fetchPostEmailResetPwd(email, vcode, password)),
        _resetPwdMobile: (phone, vcode, password,ext) => dispatch(fetchPostMobileResetPwd(phone, vcode, password,ext)),
        _getProfile: (user_id) => dispatch(fetchGetProfile(user_id)),
        _getRecentRaces: (body) => dispatch(fetchGetRecentRaces(body)),
        closeDrawer: () => dispatch(closeDrawer()),
    };
}

const mapStateToProps = state => ({
    loading: state.AccountState.loading,
    loginUser: state.AccountState.loginUser,
    error: state.AccountState.error,
    hasData: state.AccountState.hasData,
    actionType: state.AccountState.actionType

});

export default connect(mapStateToProps, bindAction)(InputPwdPage);