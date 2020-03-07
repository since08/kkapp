/**
 * Created by lorne on 2017/5/11.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput, Alert,ScrollView,
    StyleSheet, Image, Text, Modal
} from 'react-native';
import I18n from '../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {checkPhone, showToast, clearLoginUser, strNotNull,checkPhone2} from '../../utils/ComonHelper';
import {Password, SecurityText, CountDownBtn} from '../../components';
import {POST_CHANGE_BIND, POST_VERIFY_CODE, POST_V_CODE, POST_CHANGE_PERMISSION} from '../../actions/ActionTypes';
import {fetchChangBind, fetchPostVerifyCode} from '../../actions/AccountAction';
import {fetchGetRecentRaces, _getProfileOk} from '../../actions/RacesAction';
import {connect} from 'react-redux';
import {postVCode, postChangeBind, postVerifyCode} from '../../services/AccountDao';
import ExtArea from '../comm/ExtArea';

class ModalPrompt extends Component {


    constructor(props) {
        super(props);

        this.state = {
            popup: 1,
            phone: login_user.mobile,
            old_code: '',
            new_code: '',
            ext: login_user.ext
        };

        this.verifyType = '';
    };

    changed_ext = (code) => {
        this.setState({
            ext: code
        })
    };


    render() {
        return (<Modal
            onRequestClose={() => {

            }}
            style={styles.page}
            transparent={true}
            visible={this.props.modalVisible}>
            {this.showPopup()}
            <ExtArea
                ref={ref => this.areaAction = ref}
                changed_ext={this.changed_ext}
                type={'ModalPrompt'}/>
        </Modal>)
    }


    showPopup = () => {
        const {popup, phone, ext} = this.state;
        console.log(this.state)

        switch (popup) {
            case 1:
                return (<View
                    testID="page_bind_know"
                    style={styles.popUp}>
                    <TouchableOpacity
                        testID="btn_bind_close"
                        onPress={this._close}
                        activeOpacity={1}
                        style={styles.btnClose1}>
                        <Image style={styles.imgClose1}
                               source={Images.set_fork}/>

                    </TouchableOpacity>
                    <Image
                        style={styles.imgExc}
                        source={Images.set_exclamation}/>
                    <View style={styles.item}>
                        <View style={styles.point}/>

                        <Text style={styles.txtLabel}>{I18n.t('once')}</Text>
                    </View>
                    <View style={styles.item1}>
                        <View style={styles.point}/>

                        <Text style={styles.txtLabel}>{I18n.t('noChange')}</Text>
                    </View>
                    <View style={styles.item1}>
                        <View style={styles.point}/>

                        <Text style={styles.txtLabel}>{I18n.t('useNewTle')}</Text>
                    </View>


                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        testID="btn_bind_know"
                        onPress={this._btnNext}
                        style={styles.btnKnow}>
                        <Text style={styles.txtKnow}>{I18n.t('konw')}</Text>

                    </TouchableOpacity>

                </View>);
            case 3:
                return (<View
                    testID="page_bind_old_code"
                    style={styles.popUp1}>
                    <View style={styles.itemClose}>
                        <TouchableOpacity
                            testID="btn_bind_back"
                            onPress={() => {
                                this.setState({
                                    popup: 1
                                })
                            }}
                            activeOpacity={1}
                            style={styles.btnClose}>
                            <Image style={styles.imgBack}
                                   source={Images.ic_back}/>

                        </TouchableOpacity>

                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            testID="btn_bind_close"
                            onPress={this._close}
                            activeOpacity={1}
                            style={styles.btnClose}>
                            <Image style={styles.imgClose}
                                   source={Images.set_fork}/>

                        </TouchableOpacity>

                    </View>
                    <Text style={styles.txtCode}>{I18n.t('please_input_code')}</Text>
                    <View style={styles.viewSend}>
                        <Text style={styles.txtSendCode}>{I18n.t('sendCode')}</Text>
                        <SecurityText
                            securityOptions={{
                                isSecurity: true,
                                startIndex: 3,
                                endIndex: 7,
                            }}
                            style={styles.txtSendCode}>
                            {phone}
                        </SecurityText>
                    </View>


                    <CountDownBtn
                        testID="btn_get_code"
                        frameStyle={{
                            height: 45,
                            width: 112,
                            marginTop: 20,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            borderWidth: 0.5,
                            borderColor: Colors._E54
                        }}
                        beginText='获取验证码'
                        endText='获取验证码'
                        count={60}
                        pressAction={() => {
                            this._countBtn()
                        }}
                        changeWithCount={(count) => count + 's'}
                        id='btn_get_code'
                        ref={(e) => {
                            this.countDownButton = e
                        }}
                        end={this._afterEnd}
                    />


                    <Password
                        onEnd={this._codeEnd}
                        style={styles.codeInput}
                        maxLength={6}/>


                </View>);
            case 4:
                return (<View
                    testID="page_bind_input_phone"
                    style={styles.popUp}>
                    <View style={styles.itemClose}>

                        <TouchableOpacity
                            testID="btn_bind_close"
                            onPress={this._close}
                            activeOpacity={1}
                            style={styles.btnClose}>
                            <Image style={styles.imgClose}
                                   source={Images.nav_close}/>

                        </TouchableOpacity>

                    </View>

                    <Text style={styles.txtPhone}>{I18n.t('changePhone')}</Text>

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

                    <View style={styles.inputView}>
                        <TextInput
                            testID="input_bind_phone"
                            onChangeText={(text) => {
                                this.setState({
                                    phone: text
                                })
                            }}
                            value={phone}
                            clearButtonMode="always"
                            placeholder={I18n.t('writeNewPhone')}
                            placeholderTextColor="#BBBBBB"
                            underlineColorAndroid='transparent'
                            style={styles.inputPhone}/>
                    </View>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        testID="btn_bind_next"
                        onPress={this._btnNewNext}
                        style={styles.btnNext}>
                        <Text style={styles.txtNext}>{I18n.t('next')}</Text>

                    </TouchableOpacity>

                </View>);
            case 5:
                return (<View
                    testID="page_bind_new_code"
                    style={styles.popUp1}>
                    <View style={styles.itemClose}>
                        <TouchableOpacity
                            testID="btn_bind_back"
                            onPress={() => {
                                this.setState({
                                    popup: 4
                                })
                            }}
                            activeOpacity={1}
                            style={styles.btnClose}>
                            <Image style={styles.imgBack}
                                   source={Images.ic_back}/>

                        </TouchableOpacity>

                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            testID="btn_bind_close"
                            onPress={this._close}
                            activeOpacity={1}
                            style={styles.btnClose}>
                            <Image style={styles.imgClose}
                                   source={Images.set_fork}/>

                        </TouchableOpacity>

                    </View>
                    <Text style={styles.txtCode}>{I18n.t('please_input_code')}</Text>
                    <View style={styles.viewSend}>
                        <Text style={styles.txtSendCode}>{I18n.t('sendCode')}</Text>
                        <SecurityText
                            securityOptions={{
                                isSecurity: true,
                                startIndex: 3,
                                endIndex: 7,
                            }}
                            style={styles.txtSendCode}>
                            {phone}
                        </SecurityText>
                    </View>

                    <CountDownBtn
                        key={'CountDownBtn5'}
                        testID="btn_get_code5"
                        frameStyle={{
                            height: 45,
                            width: 112,
                            marginTop: 20,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            borderWidth: 0.5,
                            borderColor: Colors._E54
                        }}
                        beginText='获取验证码'
                        endText='获取验证码'
                        count={60}
                        pressAction={() => {
                            this._countBtn()
                        }}
                        changeWithCount={(count) => count + 's'}
                        id='btn_get_code5'
                        ref={(e) => {
                            this.countDownButton = e
                        }}
                        end={this._afterEnd}
                    />

                    <Password
                        onEnd={this._codeEnd}
                        style={styles.codeInput}
                        maxLength={6}/>


                </View>)

        }
    };

    _close = () => {

        this.props.modalShow()
    };


    _codeEnd = (vcode) => {
        if (this.verifyType === 'change_old_account') {
            this.setState({
                old_code: vcode
            })
        } else {
            this.setState({
                new_code: vcode
            })
        }

        if (this.state.popup === 5) {
            const body = {
                type: 'mobile',
                account: this.state.phone,
                old_code: this.state.old_code,
                new_code: vcode,
                ext: this.state.ext
            };
            postChangeBind(body, ret => {
                this._close();
                showToast(`${I18n.t('reLogin')}`);
                clearLoginUser();

                this.props._getProfileNull();
                router.popToTop();
            }, err => {

            })

        } else {
            const body = {
                option_type: this.verifyType,
                vcode_type: 'mobile',
                account: this.state.phone,
                vcode: vcode,
                ext: this.state.ext
            };

            postVerifyCode(body, ret => {
                this.setState({
                    popup: 4,
                    phone: ''
                })
            }, err => {
                Alert.alert(err)
            })
        }


    };


    _btnNewNext = () => {
        if (checkPhone2(this.state.phone,this.state.ext)) {
            this.verifyType = 'bind_new_account';
            this.setState({
                popup: 5,
            });
        }
    };

    _sendNewCode = () => {
        const body = {
            option_type: 'bind_new_account',
            vcode_type: 'mobile',
            mobile: this.state.phone,
            ext: this.state.ext
        };
        postVCode(body, ret => {
            if (this.countDownButton)
                this.countDownButton.startCountDown()
        }, err => {
            this._close()
            showToast(err)
        })
    };

    _btnNext = () => {
        this.verifyType = 'change_old_account';
        this.setState({
            popup: 3,
        });
    };


    _sendOldCode = () => {
        const body = {
            option_type: 'change_old_account',
            vcode_type: 'mobile',
            mobile: this.state.phone,
            ext: this.state.ext
        };
        postVCode(body, data => {
            if (this.countDownButton)
                this.countDownButton.startCountDown()
        }, err => {
            this._close()
            showToast(err)
        })
    };

    _afterEnd = () => {

    };
    _countBtn = () => {
        if (checkPhone2(this.state.phone,this.state.ext)) {

            if (this.verifyType === 'bind_new_account') {
                this._sendNewCode();
            } else if (this.verifyType === 'change_old_account') {
                this._sendOldCode();
            }
        }
    }


}

const bindAction = dispatch => ({
    _postChangBind: (body) => dispatch(fetchChangBind(body)),
    _postVerifyCode: (body) => dispatch(fetchPostVerifyCode(body)),
    _postVCode: (body) => dispatch(fetchPostVCode(body)),
    _changePermission: (body) => dispatch(fetchChangePermission(body)),
    _getRecentRaces: (body) => dispatch(fetchGetRecentRaces(body)),
    _getProfileNull: () => dispatch(_getProfileOk({}))
});

const mapStateToProps = state => ({
    loading: state.AccountState.loading,
    error: state.AccountState.error,
    hasData: state.AccountState.hasData,
    actionType: state.AccountState.actionType
});

export default connect(mapStateToProps, bindAction)(ModalPrompt);


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
    page: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    popUp: {
        height: 220,
        width: 300,
        backgroundColor: 'white',
        borderRadius: 3,
        marginTop: 150,
        alignSelf: 'center'
    },
    popUp1: {
        height: 250,
        width: 300,
        backgroundColor: 'white',
        borderRadius: 3,
        marginTop: 150,
        alignSelf: 'center'
    },
    imgExc: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginTop: 25
    },
    item: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center'
    },
    item1: {
        flexDirection: 'row',
        marginTop: 9,
        alignItems: 'center',
        maxWidth: '90%'
    },
    point: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: '#23262E',
        marginRight: 17,
        marginLeft: 30
    },
    txtLabel: {
        color: '#777777',
        fontSize: 13
    },
    btnKnow: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderTopColor: '#666666'
    },
    txtKnow: {
        color: '#333333',
        fontSize: 16
    },
    itemClose: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btnClose: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgClose: {
        height: 14,
        width: 14
    },
    txtPhone: {
        color: '#333333',
        fontSize: 15,
        marginTop: 15,
        alignSelf: 'center'
    },
    inputPhone: {
        fontSize: 13,
        height: 40,
        color: '#333333',
    },
    inputView: {
        marginRight: 20,
        marginLeft: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#666666',
        height: 40,
    },
    btnNext: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#555555'
    },
    txtNext: {
        color: 'white',
        fontSize: 16
    },
    imgBack: {
        height: 19,
        width: 11
    },
    txtCode: {
        color: '#333333',
        fontSize: 15,
        alignSelf: 'center'
    },
    viewSend: {
        marginTop: 19,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtSendCode: {
        color: Colors._BBBB,
        fontSize: 13,

    },
    btnSend: {
        height: 45,
        width: 112,
        marginTop: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#090909'

    },
    codeText: {
        color: '#333333',
        fontSize: 15
    },
    codeInput: {
        alignSelf: 'center',
        marginTop: 20
    },

    btnClose1: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    imgClose1: {
        height: 14,
        width: 14
    },

});

