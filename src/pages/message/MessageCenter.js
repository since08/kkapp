/**
 * Created by lorne on 2017/9/5.
 */
import React, {Component} from 'react';
import {
    StyleSheet, Image, Platform, ActivityIndicator,
    Dimensions, View, Text, ScrollView, TouchableOpacity,
    InteractionManager, FlatList
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles} from '../../Themes';
import I18n from '../../I18n/I18n';
import {NavigationBar} from '../../components';
import {isEmptyObject, showToast, utcDate, localFilePath, strNotNull, logMsg} from '../../utils/ComonHelper';
import {getActivities, getMsgUnRead} from '../../services/AccountDao';
import JMessage from "jmessage-react-plugin";
import {JPUSH_APPKEY} from '../../configs/Constants'
import Loading from "../../components/Loading";
import ImageLoad from "../../components/ImageLoad";
import {reallySize} from "../../Themes/Metrics";
import {visit_other} from "../../services/SocialDao"
import _ from "lodash"
import {connect} from "react-redux";
import {SWITCH_TAB} from "../../actions/ActionTypes";

const icons = [
    require('../../../source/message/ic_order.png'),
    require('../../../source/message/ic_activity.png'),
    require('../../../source/message/ic_poker.png')
];

const titles = [
    I18n.t('order_notice'),
    I18n.t('ads_activity'),
    '澳门旅行官方客服'
];

class MessageCenter extends Component {

    state = {
        activity: {},
        notice: {},
        activities: [],
        msgUnRead: 0,
        conversations: [],//会話列表
        refreshing: false
    };

    rows = [];


    componentDidMount() {

        getActivities(data => {
            const {activities} = data;
            if (activities.length <= 0)
                return;

            this.setState({
                activity: activities[0],
                activities: activities
            })
        }, err => {

        });

        getMsgUnRead(data => {
            const {recent_notification, unread_count} = data;
            if (isEmptyObject(recent_notification))
                return;
            this.setState({
                notice: recent_notification,
                msgUnRead: unread_count
            })

        }, err => {

        });
        this.getConversations();
        ///添加消息监听
        JMessage.addReceiveMessageListener(this.receiveMessage);


    }

    componentWillReceiveProps(newProps) {
        if (newProps.actionType === SWITCH_TAB && newProps.tab === 2) {
            this.getConversations();
        }
    }

    receiveMessage = (message) => {
        this.getConversations();
    };

    componentWillUnmount() {
        ///移除消息监听
        JMessage.removeReceiveMessageListener(this.receiveMessage);
    }

    getConversations = () => {
        this.setState({refreshing: true})
        ///获取会话列表
        JMessage.getConversations((conArr) => { // conArr: 会话数组。
            if (_.isEmpty(this.rows)) {
                this.rows = conArr;
            } else {
                this.rows = conArr.map(item => {
                    _.forEach(this.rows, value => {
                        if (item.target.username === value.target.username) {
                            item.target.avatarThumbPath = value.target.avatarThumbPath
                            item.target.nickname = value.target.nickname
                        }
                    })
                    return item;
                })

            }

            this.setState({conversations: this.rows, refreshing: false});

        }, (error) => {
            this.setState({refreshing: false})
            console.log("获取会话列表失败", error);
        });
    };

    isEqual = (arr1, arr2) => {
        console.log(arr1, arr2)
    }

    _renderItem = ({item}) => {


        let lastMessage = item.latestMessage;//最后一条消息
        let {nickname, avatarThumbPath, username} = item.target;

        let createTime = "";
        let type = "";
        let text = "";
        let unreadCount = item.unreadCount;
        //有最后一条消息
        if (lastMessage !== undefined) {
            createTime = lastMessage.createTime;
            type = lastMessage.type;
            text = lastMessage.text;
            if (type === "voice") {
                text = I18n.t("message_voice");
            }
            if (type === "image") {
                text = I18n.t("message_image");
            }
            if (type === "file") {
                text = I18n.t("message_video");
            }
        }

        if (strNotNull(createTime)) {
            createTime = this.formatDate(createTime);
        }

        if (!strNotNull(avatarThumbPath) && !strNotNull(item.avatar)) {
            item.avatar = 'request'
            visit_other({userId: username}, data => {
                item.target.avatarThumbPath = data.avatar;
                item.target.nickname = data.nickname;
                this.setState({conversations: this.rows})
            }, err => {
            })
        }else if(avatarThumbPath.indexOf('http')<0 && !strNotNull(item.avatar)){
            item.avatar = 'request'
            visit_other({userId: username}, data => {
                item.target.avatarThumbPath = data.avatar;
                item.target.nickname = data.nickname;
                this.setState({conversations: this.rows})
            }, err => {
            })
        }


        return (
            <TouchableOpacity
                onPress={() => {
                    router.toMessageList({
                        username: username,
                        nickname: nickname,
                        avatarThumbPath: avatarThumbPath,
                        reloadPage: () => {
                            this.getConversations();
                        }
                    });
                }}
                keyExtractor={(item, index) => index + ""}
                style={{backgroundColor: 'white'}}>
                <View style={styles.flatItem}>
                    <ImageLoad
                        emptyBg={Images.home_avatar}
                        style={styles.msgIcon}
                        source={{uri: avatarThumbPath}}/>
                    <View>
                        <Text style={styles.msgTitle} numberOfLines={1}>{nickname}</Text>
                        <Text style={styles.msgDesc} numberOfLines={1}>{text}</Text>
                    </View>
                    <Text style={styles.msgTime}>{createTime}</Text>
                </View>

                {unreadCount !== 0 ?
                    <View style={styles.unread}>
                        <Text style={{color: "white"}}>{unreadCount}</Text>
                    </View> : null}
            </TouchableOpacity>
        );
    };

    render() {
        const {activity, notice, msgUnRead} = this.state;
        return (<View style={ApplicationStyles.bgContainer}>
            <NavigationBar
                toolbarStyle={{backgroundColor: Colors._E54}}
                router={router}
                title={'消息'}
            />


            <FlatList data={this.state.conversations}
                      renderItem={this._renderItem}
                      refreshing={this.state.refreshing}
                      onRefresh={() => {
                          this.getConversations();
                      }}
                      ListHeaderComponent={
                          <View>
                              {/*{this.readerItem(0, I18n.t('order_notice'), notice.title, notice.created_at, msgUnRead)}*/}
                              {/*{this.readerItem(1, I18n.t('ads_activity'), activity.title, activity.activity_time, 0)}*/}
                              <View style={[{height: 1}, {backgroundColor: "white"}]}>
                                  <View style={[{height: 1}, {backgroundColor: "#ECECEE"}, {marginLeft: 15}]}/>
                              </View>
                          </View>
                      }
                      ItemSeparatorComponent={() => {
                          return (
                              <View style={[{height: 1}, {backgroundColor: "white"}]}>
                                  <View style={[{height: 1}, {backgroundColor: "#ECECEE"}, {marginLeft: 15}]}/>
                              </View>
                          );
                      }}
            />
            <Loading ref={ref => this.loading = ref} cancelable={true}/>
        </View>)
    }


    readerItem = (index, title, desc, time, msgUnRead) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    if (index === 0)
                        router.toMessagePage();
                    else if (index === 1)
                        router.toActivityCenter(this.props, this.state.activities)

                }}
                style={{backgroundColor: 'white'}}>
                {index !== 0 ? <View style={styles.msgLine}/> : null}
                <View style={styles.flatItem}>
                    <Image style={styles.msgIcon}
                           source={icons[index]}/>
                    {msgUnRead <= 0 ? null : <View style={styles.msgRed}/>}
                    <View>
                        <Text style={styles.msgTitle}>{title}</Text>
                        <Text style={styles.msgDesc}>{desc}</Text>
                    </View>

                    <Text style={styles.msgTime}>{utcDate(time, 'YYYY/MM/DD')}</Text>


                </View>
            </TouchableOpacity>)
    };


    formatDate(timestamp, formater) {
        let date = new Date();
        date.setTime(parseInt(timestamp));
        formater = (formater != null) ? formater : 'yyyy-MM-dd hh:mm';
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1, //月
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };

            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                    (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        }
        return date.Format(formater);
    }

}


const bindAction = dispatch => ({});

const mapStateToProps = state => ({

    actionType: state.AccountState.actionType,
    tab: state.AccountState.tab,
});

export default connect(mapStateToProps, bindAction)(MessageCenter);

const styles = StyleSheet.create({
    flatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: reallySize(78),
    },
    msgIcon: {
        height: reallySize(54),
        width: reallySize(54),
        borderRadius: 27,
        marginLeft: 18,
        marginRight: 22
    },
    msgTitle: {
        fontSize: 16,
        color: Colors.txt_444
    },
    msgDesc: {
        fontSize: 14,
        color: Colors._888,
        marginTop: 10
    },
    msgTime: {
        fontSize: 12,
        color: Colors._AAA,
        position: 'absolute',
        top: 30,
        right: 10
    },
    msgLine: {
        height: 1,
        backgroundColor: Colors._ECE,
        marginLeft: 18,
    },
    msgRed: {
        height: 10,
        width: 10,
        backgroundColor: '#D0011B',
        borderRadius: 5,
        position: 'absolute',
        top: 25,
        left: 67
    },
    unread: {
        backgroundColor: "red",
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        position: 'absolute',
        marginTop: 25,
        marginLeft: 58,
    }
});