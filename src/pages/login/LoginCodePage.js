/**
 * Created by lorne on 2017/1/21.
 */
import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import I18n from '../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import NavigationBar from '../../components/NavigationBar';
import {connect} from 'react-redux';
import {
  checkPhone,
  strNotNull,
  showToast,
  checkPhone2,
} from '../../utils/ComonHelper';
import {CountDownText} from '../../components/countdown/CountDownText';
import {
  fetchPostVerifyCode,
  fetchPostVCode,
  fetchPostLogin,
} from '../../actions/AccountAction';
import {fetchGetProfile} from '../../actions/PersonAction';
import {fetchGetRecentRaces} from '../../actions/RacesAction';
import {POST_VCODE_LOGIN} from '../../actions/ActionTypes';
import {closeDrawer} from '../../reducers/DrawerRedux';
import {postVCode, postLogin} from '../../services/AccountDao';
import ExtArea from '../comm/ExtArea';

class LoginCodeView extends Component {
  state = {
    mobile: '',
    vcode: '',
    getCodeDisable: false,
    phoneClear: false,
    ext: '86',
  };

  doLogin = () => {
    const {mobile, vcode, ext} = this.state;
    if (strNotNull(mobile) && strNotNull(vcode) && strNotNull(ext)) {
      let body = {
        type: 'vcode',
        mobile: mobile,
        vcode: vcode,
        ext: ext,
      };
      postLogin(
        body,
        data => {
          const {user_id} = data.data;

          showToast(I18n.t('login_success'));
          this.props._getProfile(user_id);
          router.popToTop();
        },
        err => {
          showToast(err);
        },
      );
    } else {
      showToast(`${I18n.t('fillWhole')}`);
    }
  };
  _sendCode = () => {
    const {mobile, ext} = this.state;
    if (checkPhone2(mobile, ext) && strNotNull(ext)) {
      const body = {
        option_type: 'login',
        vcode_type: 'mobile',
        mobile: mobile,
        ext: ext,
      };
      postVCode(
        body,
        data => {
          showToast(I18n.t('mobile_code_send'));
          this.setState({
            getCodeDisable: true,
          });
          this.countDownText.start();
        },
        err => {
          showToast(err);
        },
      );
    } else {
      if (!strNotNull(ext)) showToast('信息请填写完整');
    }
  };

  _can_get_code = () => {
    console.log('_can_get_code');
    this.setState({
      getCodeDisable: false,
    });
  };

  _phoneClear = () => {
    return (
      <TouchableOpacity
        testID="btn_input_phone_clear"
        onPress={() => this.mobile.clear()}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          width: 50,
        }}>
        <Image
          style={{height: 13, width: 13}}
          source={Images.sign_close_gray}
        />
      </TouchableOpacity>
    );
  };

  changed_ext = code => {
    this.setState({
      ext: code,
    });
  };

  render() {
    const {getCodeDisable, phoneClear, ext} = this.state;
    return (
      <View
        testID="page_login_code"
        style={{
          flex: 1,
          backgroundColor: Colors.bg_f5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <NavigationBar
          leftBtnIcon={Images.sign_return}
          leftImageStyle={{
            height: 19,
            width: 11,
            marginLeft: 20,
            marginRight: 20,
          }}
          toolbarStyle={{backgroundColor: Colors._E54}}
          rightBtnText={I18n.t('register')}
          btnTextStyle={{
            color: Colors.white,
            fontSize: 16,
            marginRight: 20,
          }}
          leftBtnPress={() => router.pop()}
          rightBtnPress={() => router.toRegisterPage()}
        />
        <View style={{flex: 1}}>
          {/*区号选择*/}
          <TouchableOpacity
            style={styles.areaView}
            onPress={() => {
              this.areaAction && this.areaAction.toggle();
            }}>
            <TextInput
              style={{width: 100}}
              autoFocus={false}
              editable={false}
              placeholderTextColor={Colors._BBBB}
              underlineColorAndroid="transparent"
              testID="ext"
              // placeholder={!strNotNull(ext) ? '86' : ext}
              value={ext}
            />
            <View style={{flex: 1}} />

            <Image style={{width: 16, height: 12}} source={Images.bottomarea} />
          </TouchableOpacity>

          {/*手机号*/}
          <View style={[styles.input_view, {marginTop: 8}]}>
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors._BBBB}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({
                  mobile: text,
                  phoneClear: text.length > 0,
                });
              }}
              testID="input_phone"
              ref={ref => (this.mobile = ref)}
              placeholder={I18n.t('please_input_phone')}
            />
            {phoneClear ? this._phoneClear() : null}
          </View>

          {/*验证码*/}
          <View style={styles.input_view}>
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors._BBBB}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({
                  vcode: text,
                });
              }}
              testID="input_code"
              placeholder={I18n.t('vcode')}
            />

            <TouchableOpacity
              activeOpacity={1}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 60,
                width: 135,
                backgroundColor: getCodeDisable ? Colors._BBBB : Colors._E54,
              }}
              onPress={this._sendCode}
              testID="btn_get_code"
              disabled={getCodeDisable}>
              <CountDownText
                style={{
                  color: getCodeDisable ? Colors._747474 : Colors.white,
                  fontSize: 15,
                }}
                countType="seconds" // 计时类型：seconds / date
                afterEnd={this._can_get_code} // 结束回调
                auto={false} // 自动开始
                timeLeft={60} // 正向计时 时间起点为0秒
                step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                startText={I18n.t('get_vcode')} // 开始的文本
                endText={I18n.t('get_vcode')} // 结束的文本
                ref={ref => (this.countDownText = ref)}
                intervalText={sec => sec + 's'} // 定时的文本回调
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            testID="btn_login"
            style={[styles.btn_sign_in, {marginTop: 43}]}
            onPress={this.doLogin}>
            <Text style={styles.btn_text_sign}>{I18n.t('sign_in')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: Colors._888,
              marginTop: 29,
              alignSelf: 'center',
            }}
            transparent
            testID="btn_problem"
            onPress={() => router.toForgetPage()}>
            <Text style={styles.text_problem}>
              {I18n.t('problem_for_sign_in')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{marginBottom: 48, padding: 5}}
          testID="btn_switch_login_account"
          onPress={() => router.pop()}>
          <Text style={styles.text_other_sign}>{I18n.t('sign_with_pass')}</Text>
        </TouchableOpacity>

        <ExtArea
          ref={ref => (this.areaAction = ref)}
          changed_ext={this.changed_ext}
        />
      </View>
    );
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_view: {
    borderBottomColor: Colors._E5E5,
    borderBottomWidth: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    width: Metrics.screenWidth,
    backgroundColor: 'white',
  },
  input: {
    height: 50,
    color: Colors.txt_666,
    fontSize: 15,
    flex: 1,
    alignSelf: 'center',
    marginLeft: 20,
  },
  btn_sign_in: {
    alignSelf: 'center',
    backgroundColor: Colors._E54,
    height: 45,
    justifyContent: 'center',
    borderRadius: 5,
    width: 336,
  },
  text_other_sign: {
    fontSize: 14,
    color: Colors._AAA,
  },
  btn_text_sign: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 19,
  },
  text_problem: {
    fontSize: 14,
    color: Colors._888,
  },
});

function bindAction(dispatch) {
  return {
    fetchVerifyCode: body => dispatch(fetchPostVerifyCode(body)),
    fetchVCode: body => dispatch(fetchPostVCode(body)),
    _fetchPostLogin: body => dispatch(fetchPostLogin(body)),
    _getProfile: user_id => dispatch(fetchGetProfile(user_id)),
    _getRecentRaces: body => dispatch(fetchGetRecentRaces(body)),
    closeDrawer: () => dispatch(closeDrawer()),
  };
}

const mapStateToProps = state => ({
  loading: state.AccountState.loading,
  error: state.AccountState.error,
  hasData: state.AccountState.hasData,
  actionType: state.AccountState.actionType,
  loginUser: state.AccountState.loginUser,
});

export default connect(mapStateToProps, bindAction)(LoginCodeView);
