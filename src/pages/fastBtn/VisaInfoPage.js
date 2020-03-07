import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import RenderHtml from '../comm/RenderHtml';
import {convertDate, util, call} from '../../utils/ComonHelper';
import {getApiType} from '../../services/RequestHelper';

export default class VisaInfoPage extends Component {
  render() {
    return (
      <View style={ApplicationStyles.bgContainer}>
        <NavigationBar
          barStyle={'dark-content'}
          toolbarStyle={{backgroundColor: 'white'}}
          titleStyle={{fontSize: 18, color: '#444444'}}
          title="签证"
          leftBtnIcon={Images.coupon.return_hei}
          leftImageStyle={{
            height: 19,
            width: 11,
            marginLeft: 20,
            marginRight: 20,
          }}
          leftBtnPress={() => {
            router.pop();
          }}
        />
        <View
          style={{
            flex: 1,
            marginTop: 1,
            backgroundColor: 'white',
            paddingLeft: 17,
            paddingRight: 17,
          }}>
          {/*<Text style={[styles.txt1, {marginTop: 20}]}>港澳通行证团队旅游L签续签办理</Text>*/}
          {/*<Text style={[styles.txt2, {marginTop: 20}]}>合作商铺地址：珠海市香洲区拱北地下口岸广场t字通道*/}
          {/*</Text>*/}
          {/*<Text style={[styles.txt2, {marginTop: 5}]}>营业时间：11:30 至20:30*/}
          {/*</Text>*/}

          {/*<TouchableOpacity onPress={() => {*/}
          {/*let phone = "13169674979"*/}
          {/*call(phone);*/}
          {/*}}>*/}
          {/*<Text style={[styles.txt2, {marginTop: 5}]}>请联系电话：+86-13169674979</Text>*/}
          {/*</TouchableOpacity>*/}

          <RenderHtml html={global.visa_description} />

          {/* <TouchableOpacity onPress={() => {
                        if (getApiType() === 'test') {
                            global.router.toMallInfoPage({id: 9})
                        } else {
                            global.router.toMallInfoPage({id: 67})
                        }

                    }}
                                      style={[styles.btn,{backgroundColor:"#E54A2E",marginTop: 36}]}>
                        <Text style={[styles.txt3, {
                            alignSelf: 'center'
                        }]}>快签办理点击前往>></Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (getApiType() === 'test') {
                            global.router.toMallInfoPage({id: 10})
                        } else {
                            global.router.toMallInfoPage({id: 68})
                        }
                    }}
                                      style={[styles.btn,{backgroundColor:"#4A90E2",marginTop: 20}]}>
                        <Text style={[styles.txt3, {
                            alignSelf: 'center'
                        }]}>慢签办理点击前往>></Text>
                    </TouchableOpacity>
                 */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txt1: {
    color: '#444444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  txt2: {
    color: '#444444',
    fontSize: 14,
  },
  txt3: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 17,
    marginRight: 17,
    borderRadius: 2,
    height: 48,
  },
});
