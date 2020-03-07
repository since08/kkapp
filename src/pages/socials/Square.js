import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {reallySize} from './Header';
import {Images, ApplicationStyles, Metrics, Colors} from '../../Themes';
import I18n from '../../I18n/I18n';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MomentList from './MomentList';
import PopAction from '../comm/PopAction';
import {
  isEmptyObject,
  isLoginUser,
  logMsg,
  showToast,
  strNotNull,
} from '../../utils/ComonHelper';
import {report_topic} from '../../services/SocialDao';
import {getMsgUnRead} from '../../services/AccountDao';
import {getUnreadComments} from '../../services/CommentDao';

let topicId = -1;

export default class Square extends PureComponent {
  state = {
    square_types: ['topics','recommends'],
    unread_count: 0,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    //获取未读消息
    let body = {user_id: global.login_user.user_id};
    if (strNotNull(body) && isLoginUser()) {
      getUnreadComments(
        body,
        data => {
          console.log('unreadCount:', data);
          this.setState({
            unread_count: data.unread_count,
          });
        },
        err => {},
      );
    }
  };

  setUnreadCount = unread_count => {
    this.setState({
      unread_count,
    });
  };

  //举报原因
  report = index => {
    let reportList = global.reportList;
    let data = reportList[index];
    let body = {
      body: data.name,
      target_id: topicId,
      target_type: 'topic',
    };
    report_topic(
      body,
      ret => {
        showToast('举报成功');
      },
      err => {
        console.log(err);
      },
    );
    this.popAction && this.popAction.toggle();
  };

  //弹窗
  popActions = () => {
    let reportList = global.reportList;
    let resultArray = [];
    reportList.forEach((data, index) => {
      let item = {
        name: data.name,
        txtStyle: {color: '#4A90E2'},
        onPress: () => this.report(index),
      };
      resultArray.push(item);
    });
    resultArray.push({
      name: I18n.t('cancel'),
      txtStyle: {color: Colors._AAA},
      onPress: () => this.popAction.toggle(),
    });
    return resultArray;
  };

  render() {
    return (
      <View style={ApplicationStyles.bgContainer}>
        <ScrollableTabView renderTabBar={() => <SquareBar />}>
          {this.state.square_types.map(item => {
            return (
              <MomentList
                key={item}
                tabLabel={this.tabLabel(item)}
                type={item}
                showMore={id => {
                  topicId = id;
                  this.popAction && this.popAction.toggle();
                }}
                unread_count={this.state.unread_count}
                setUnreadCount={this.setUnreadCount}
                refresh={this.refresh}
              />
            );
          })}
        </ScrollableTabView>

        <PopAction
          ref={ref => (this.popAction = ref)}
          btnArray={this.popActions()}
        />
      </View>
    );
  }

  tabLabel = type => {
    if (type === 'topics') return I18n.t('social.square');
    if (type === 'recommends') return I18n.t('social.essence');
    return I18n.t('social.follow');
  };
}

class SquareBar extends PureComponent {
  render() {
    const {tabs, activeTab, goToPage} = this.props;

    if (activeTab === 2 && isEmptyObject(global.login_user))
      global.router.toLoginFirstPage();
    let tabs_views = tabs.map((item, index) => (
      <TouchableOpacity
        key={'bar' + index}
        onPress={() => {
          goToPage(index);
        }}
        style={{
          height: Metrics.navBarHeight - Metrics.statusBarHeight,
          marginTop: 2,
          alignItems: 'center',
          justifyContent: 'center',
          width: 105,
          borderRadius: 4,
        }}>
        <ImageBackground
          style={{
            width: 82,
            height: 28,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          source={
            activeTab === index
              ? Images.navigation2.show2
              : Images.navigation2.show1
          }>
          <Text
            style={[
              {marginBottom: 3, fontSize: activeTab === index ? 16 : 14},
              activeTab === index
                ? {color: Colors.white}
                : {color: Colors.white},
            ]}>
            {item}
          </Text>
        </ImageBackground>

        {/*{activeTab === index ? <View style={{*/}
        {/*height: 2, width: 45, backgroundColor: Colors.white,*/}
        {/*position: 'absolute', bottom: 0*/}
        {/*}}/> : null}*/}
      </TouchableOpacity>
    ));

    return (
      <View style={{width: '100%', backgroundColor: Colors._E54}}>
        <SafeAreaView />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {/*<TouchableOpacity*/}
          {/*onPress={() => {*/}
          {/*global.router.pop()*/}
          {/*}}*/}
          {/*style={{*/}
          {/*position: 'absolute', height: 40, width: 50,*/}
          {/*alignItems: 'center', justifyContent: 'center',*/}
          {/*left: 0, bottom: 0*/}
          {/*}}>*/}
          {/*<Image style={{height: 19, width: 10}}*/}
          {/*source={Images.social.back}/>*/}
          {/*</TouchableOpacity>*/}
          {tabs_views}

          <TouchableOpacity
            onPress={() => router.toNearFriend()}
            style={{
              height: Metrics.navBarHeight - Metrics.statusBarHeight,
              alignItems: 'center',
              position: 'absolute',
              right: 15,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, color: 'white'}}>附近的人</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
