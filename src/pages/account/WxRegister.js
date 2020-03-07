/**
 * Created by lorne on 2017/8/25.
 */
import React from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, KeyboardAvoidingView
} from 'react-native';
import I18n from "../../I18n/I18n";
import NavigationBar from '../../components/NavigationBar';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {fetchPostVerifyCode, fetchPostVCode} from '../../actions/AccountAction';
import {checkPhone2, strNotNull, showToast, checkMail, getDispatchAction} from '../../utils/ComonHelper';
import {BtnLong, BtnSoild, InputView, CountDownBtn} from '../../components';
import {postVCode, postVerifyCode, postWxBind, getAccountExit} from '../../services/AccountDao';
import {GET_RECENT_RACES, GET_PROFILE} from '../../actions/ActionTypes';
import ExtArea from '../comm/ExtArea';

export default class WxRegister extends React.Component {


    state = {
        canNextDisable: true,
        mobile: '',
        vcode: '',
        ext: '86'
    };

    _inputMobileCodeView = () => {
        const {ext} = this.state;
        return (
            <View>
                {/*区号选择*/}
                <TouchableOpacity style={styles.areaView} onPress={() => {
                    this.areaAction && this.areaAction.toggle();
                }}>
                    <TextInput
                        style={{width:100}}
                        autoFocus={false}
                        editable={false}
                        placeholderTextColor={Colors._BBBB}
                        underlineColorAndroid='transparent'
                        testID="ext"
                        // placeholder={!strNotNull(ext) ? '86' : ext}
                        value={ext}/>
                    <View style={{flex: 1}}/>

                    <Image style={{width: 16, height: 12}} source={Images.bottomarea}/>
                </TouchableOpacity>

                {/*手机号*/}
                <View style={{backgroundColor:'white',marginTop:8}}>
                    <InputView
                        testID="input_phone"
                        placeholder={I18n.t('please_input_phone')}
                        stateText={(text) => {
                            this.setState({
                                mobile: text,
                                canNextDisable: !(text.length > 0 && this.state.vcode.length > 0)
                            })
                        }}
                    />
                </View>
                {/*验证码*/}
                <View style={[styles.input_view,{backgroundColor:'white'}]}>
                    <TextInput style={styles.input}
                               placeholderTextColor={Colors._BBBB}
                               underlineColorAndroid='transparent'
                               onChangeText={text => {
                                   this.setState({
                                       vcode: text,
                                       canNextDisable: !(text.length > 0 && this.state.mobile.length > 0)
                                   })
                               }}
                               testID="input_code"
                               placeholder={I18n.t('vcode')}/>

                    <CountDownBtn
                        frameStyle={{height: 60, width: 135, borderRadius: 0}}
                        beginText='获取验证码'
                        endText='再次获取验证码'
                        count={60}
                        pressAction={() => {
                            this._postVcode()
                        }}
                        changeWithCount={(count) => count + 's'}
                        id='register'
                        ref={(e) => {
                            this.countDownButton = e
                        }}
                    />
                </View>
            </View>
        )
    };

    _postVcode = () => {
        const {mobile, ext} = this.state;
        if (checkPhone2(mobile,ext) && strNotNull(ext)) {
            const body = {
                option_type: 'bind_wx_account',
                vcode_type: 'mobile',
                mobile: this.state.mobile,
                ext: ext
            };


            postVCode(body, data => {
                if (this.countDownButton)
                    this.countDownButton.startCountDown()
            }, err => {
                showToast(err)
            })
        }
    };

    _next = () => {
        const {mobile, vcode,ext} = this.state;

        if (mobile.length > 1 && vcode.length > 1) {
            const body = {
                option_type: 'bind_wx_account',
                vcode_type: 'mobile',
                account: mobile,
                vcode: vcode,
                ext:ext
            };
            const account = {
                account: mobile
            };
            getAccountExit(account, data => {
                const {exist} = data;
                if (exist === 0)
                    postVerifyCode(body, data => {
                        const wx = {
                            access_token: this.props.params.access_token,
                            type: "mobile",
                            account: mobile,
                            code: vcode,
                            ext:ext
                        };
                        router.toInputPwd(wx)

                    }, err => {
                        showToast(err)
                    });
                else if (exist === 1)
                    postVerifyCode(body, data => {
                        const wx = {
                            access_token: this.props.params.access_token,
                            type: "mobile",
                            account: mobile,
                            code: vcode,
                            ext:ext
                        };

                        postWxBind(wx, data => {
                            console.log('wx', data);
                            const {user_id} = data;
                            const recentRaces = {
                                user_id: user_id,
                                number: 8
                            };

                            getDispatchAction()[GET_RECENT_RACES](recentRaces);
                            getDispatchAction()[GET_PROFILE](user_id);
                            router.popToTop();

                        }, err => {

                        });

                    }, err => {
                        showToast(err)
                    });

            }, err => {

            });

        }
        else
            showToast(`${I18n.t('fillWhole')}`);

    };

    render() {
        const {canNextDisable} = this.state;

        return (
            <View
                testID="page_phone_register"
                style={{flex: 1, backgroundColor: Colors.bg_f5}}>
                <TouchableOpacity
                    testID="btn_home_page"
                    onPress={() => router.popToTop()}/>
                <View style={{backgroundColor: Colors._E54}}>
                    <NavigationBar
                        title={I18n.t('phone')}
                        leftBtnIcon={Images.sign_return}
                        leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => router.pop()}/>
                </View>

                {this._inputMobileCodeView()}

                <Text style={{
                    color: Colors._AAA, fontSize: 12,
                    marginTop: 17, alignSelf: 'center'
                }}>
                    {I18n.t('chang_use_phone')}</Text>

                {/*下一步按钮*/}
                <BtnSoild
                    testID="btn_next"
                    onPress={this._next}
                    name={I18n.t('bang')}
                    style={{
                        marginTop: 19,
                        backgroundColor: canNextDisable ? Colors._AAA : Colors._E54
                    }}
                    disabled={canNextDisable}
                    textStyle={{color: canNextDisable ? Colors.white : Colors.white}}/>


                <View style={{flex: 1}}/>

                <ExtArea
                    ref={ref => this.areaAction = ref}
                    changed_ext={this.changed_ext}/>
            </View>

        )
    }
    changed_ext = (code) => {
        this.setState({
            ext: code
        })
    }

    _protocol = () => {
        this.setState({
            checkAgree: true
        })
    }
}

const styles = StyleSheet.create({
    areaView: {
        marginTop: 7,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: 'white',
        flexDirection: 'row', alignItems: 'center'
    },
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
    btn_sign_in: {
        alignSelf: 'center',
        backgroundColor: Colors._E54,
        height: 45,
        justifyContent: 'center',
        borderRadius: 5,
        width: 336
    },
    text_other_sign: {
        fontSize: 14,
        color: Colors.txt_666,
        marginBottom: 48
    },
    btn_text_sign: {
        alignSelf: 'center',
        color: Colors.white,
        fontSize: 19
    },
    text_problem: {
        fontSize: 14,
        color: Colors._999,
    },

});

