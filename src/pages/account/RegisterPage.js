/**
 * Created by lorne on 2017/1/23.
 */
import React from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, KeyboardAvoidingView, FlatList, Modal
} from 'react-native';
import {connect} from 'react-redux';
import I18n from "../../I18n/I18n";
import NavigationBar from '../../components/NavigationBar';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {CountDownText} from '../../components/countdown/CountDownText';
import {fetchPostVerifyCode, fetchPostVCode} from '../../actions/AccountAction';
import {checkPhone, strNotNull, showToast, checkMail, checkPhone2} from '../../utils/ComonHelper';
import {POST_VERIFY_CODE, POST_V_CODE} from '../../actions/ActionTypes';
import {BtnLong, BtnSoild, InputView} from '../../components';
import {postVCode, postVerifyCode} from '../../services/AccountDao';
import * as Animatable from 'react-native-animatable';
import ExtArea from '../comm/ExtArea';

class RegisterPage extends React.Component {

    state = {
        mobile: '',
        vcode: '',
        getCodeDisable: false,
        checkAgree: true,
        canNextDisable: true,
        phoneClear: false,
        ext: '86'
    }


    _sendCode = () => {
        const {mobile, ext} = this.state;
        if (checkPhone2(mobile, ext) && strNotNull(ext)) {
            const body = {
                option_type: 'register',
                vcode_type: 'mobile',
                mobile: mobile,
                ext: ext
            };

            postVCode(body, ret => {
                this.setState({
                    getCodeDisable: true
                });
                this.countDownText.start();
                if (body.vcode_type === 'mobile') {
                    showToast(I18n.t('mobile_code_send'))
                } else {
                    showToast(I18n.t('email_code_send') + body.email)
                }
            }, err => {
                showToast(err);
            });


        }
    }


    _can_get_code = () => {
        console.log('_can_get_code')
        this.setState({
            getCodeDisable: false
        });
    };

    changed_ext = (code) => {
        this.setState({
            ext: code
        })
    }

    _inputMobileCodeView = () => {
        const {getCodeDisable, ext} = this.state;
        return (
            <View>

                {/*区号选择*/}
                <TouchableOpacity style={styles.areaView} onPress={() => {
                    this.areaAction && this.areaAction.toggle();
                }}>
                    <TextInput
                        style={{width: 100}}
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
                <View style={{width: Metrics.screenWidth, backgroundColor: 'white', marginTop: 8}}>
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
                <View style={styles.input_view}>
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
                               placeholder={'请输入验证码'}/>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 60, width: 135,
                            backgroundColor: getCodeDisable ? Colors._BBBB : Colors._E54
                        }}
                        onPress={this._sendCode}
                        testID="btn_get_code"
                        disabled={getCodeDisable}>

                        <CountDownText style={{
                            color: getCodeDisable ? Colors._747474 : Colors.white,
                            fontSize: 15
                        }}
                                       countType='seconds' // 计时类型：seconds / date
                                       afterEnd={this._can_get_code} // 结束回调
                                       auto={false} // 自动开始
                                       timeLeft={60} // 正向计时 时间起点为0秒
                                       step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                       startText={I18n.t('get_vcode')} // 开始的文本
                                       endText={I18n.t('get_vcode')} // 结束的文本
                                       ref={ref => this.countDownText = ref}
                                       intervalText={(sec) => sec + 's'} // 定时的文本回调
                        />

                    </TouchableOpacity>

                </View>

                <ExtArea
                    ref={ref => this.areaAction = ref}
                    changed_ext={this.changed_ext}/>

            </View>
        )
    }

    _next = () => {
        const {checkAgree, mobile, vcode, ext} = this.state;
        if (checkAgree) {
            if (mobile.length > 1 && vcode.length > 1 && strNotNull(ext)) {
                let body = {
                    option_type: 'register',
                    vcode_type: 'mobile',
                    account: mobile,
                    vcode: vcode,
                    ext: ext
                };

                postVerifyCode(body, data => {
                    router.toInputPwdPage(this.props, mobile, vcode, ext)
                }, err => {
                    showToast(err)
                })


            }
            else
                showToast(`${I18n.t('fillWhole')}`);
        }
        else
            showToast(I18n.t('need_agree'));
    };

    render() {
        const {canNextDisable, checkAgree, ext} = this.state;
        return (
            <View
                testID="page_phone_register"
                style={{flex: 1, backgroundColor: Colors.bg_f5}}>
                <TouchableOpacity
                    testID="btn_home_page"
                    onPress={() => router.popToTop()}/>
                <View style={{backgroundColor: Colors._E54, zIndex: 9999}}>
                    <NavigationBar
                        title={I18n.t('register_with_phone')}
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
                    name={I18n.t('next')}
                    style={{
                        marginTop: 19,
                        backgroundColor: canNextDisable ? Colors._AAA : Colors._E54
                    }}
                    disabled={canNextDisable}
                    textStyle={{color: canNextDisable ? Colors.white : Colors.white}}/>

                <TouchableOpacity
                    style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: Colors._999,
                        alignSelf: 'flex-end',
                        marginTop: 29,
                        marginRight: 20
                    }}
                    transparent
                    testID="btn_have_account"
                    onPress={() => router.pop()}>

                    <Text style={styles.text_problem}>{I18n.t('i_have_account')}</Text>

                </TouchableOpacity>

                {/*使用邮箱注册*/}
                {/*<BtnLong*/}
                {/*style={{marginTop: 35}}*/}
                {/*testID="btn_switch_email_register"*/}
                {/*onPress={() => {*/}
                {/*this.countDownText.end();*/}
                {/*router.toEmailRegisterPage()*/}
                {/*}}*/}
                {/*name={I18n.t('email_register')}/>*/}


                <View style={{flex: 1}}/>
                <TouchableOpacity
                    onPress={() => {
                        router.toProtocol(this.props, this._protocol)
                    }}
                    style={{marginBottom: 49}}>
                    <View style={{alignItems: 'flex-end', flexDirection: 'row', alignSelf: 'center'}}>
                        <Image style={{height: 12, width: 12, marginRight: 8}}
                               source={checkAgree ? Images.sign_choice_no : Images.sign_choice}/>
                        <Text
                            textDecorationLine="underline"
                            style={{color: Colors._333, fontSize: 12}}>
                            {I18n.t('protocol')}</Text>
                    </View>
                </TouchableOpacity>

            </View>

        )
    }

    _protocol = () => {
        this.setState({
            checkAgree: true
        })
    }
}

const styles = StyleSheet.create({
    page3: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999
    },
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
        width: Metrics.screenWidth,
        backgroundColor: 'white'
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

})

function bindAction(dispatch) {
    return {
        fetchVerifyCode: (body) => dispatch(fetchPostVerifyCode(body)),
        fetchVCode: (body) => dispatch(fetchPostVCode(body))
    };
}


const mapStateToProps = state => ({
    loading: state.AccountState.loading,
    error: state.AccountState.error,
    hasData: state.AccountState.hasData,
    actionType: state.AccountState.actionType

});

export default connect(mapStateToProps, bindAction)(RegisterPage);