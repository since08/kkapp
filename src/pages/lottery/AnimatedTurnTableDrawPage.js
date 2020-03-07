/**
 * AnimatedTurnTableDrawPage.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/10/8.
 *
 */

import React, {Component} from "react"
import {
    Animated,
    Easing,
    View,
    TouchableOpacity,
    Modal,
    Image,
    StyleSheet,
    Dimensions,
    Text,
    ImageBackground, Alert
} from "react-native";
import {Images, Metrics} from '../../Themes'
import {
    getTaskCount,
    getElements,
    postLottery,
    getWheelTime,
    getprizeMessages,
    postWheelTimes, getActivityInfo, postShareCount
} from "../../services/AccountDao";
import {
    alertOrder,
    getDispatchAction, getShareIcon,
    isEmptyObject,
    logMsg,
    shareHost, shareTxt,
    showToast,
    strNotNull,
    uShareActivity,
    uShareInfoItem,
    uShareRegistered, alertLotteryOrder
} from "../../utils/ComonHelper";
import Swiper from 'react-native-swiper';
import ShareView from '../comm/ShareToast'
import {SHARE_CLOSE} from "../../actions/ActionTypes";


const rule_list = [{id: 0, name: '每日登录', des: '每日可获得2次抽奖机会', image: Images.integral.login, status: '已完成'},
    {id: 1, name: '游戏分享', des: '每分享一次可获得1次抽奖机会', image: Images.integral.share, status: '未完成'},
    {id: 2, name: '好友邀请', des: '邀请好友注册成功可获得1次抽奖机会', image: Images.integral.frends, status: '未完成'},
    {id: 3, name: '积分兑换', des: '每200积分可购买1次抽奖机会', image: Images.integral.exchange, status: '兑换'}];
const prompts = ['1.完成每日任务，最高每日可获得45积分', '2.成功购买商城现金商品，可获得等额积分', '3.转盘小游戏还有赢取积分的机会哦～'];
const shareIcon = 'http://kkh5.deshpro.com/images/default_img.png';

export default class AnimatedTurnTableDrawPage extends Component {

    constructor(props) {
        super(props);
        if (this.props.pop) {
            router.popToTop();
        }
        this.state = {
            drawData: {},
            lottery: 1,
            offOn: true,
            rotateDeg: new Animated.Value(0),
            visible: this.props.pop,
            total_points: 0,
            rule_show: false,
            wheel_times: 0,
            prize_messages: [],
            task_count: {},
            rule_lists: rule_list,
            fadeOutOpacity: new Animated.Value(0),
            showShare: false,
            shareParam: {},
            shareParam_invite: {},
            visibleSwiper: false,
            showInviteShare: false
        };

        this.fadeOutAnimated = Animated.timing(
            this.state.fadeOutOpacity,
            {
                toValue: 1,  //透明度动画最终值
                duration: 1000,   //动画时长3000毫秒
                easing: Easing.in,
            }
        );
    };

    componentDidMount() {
        this.fadeOutAnimated.start(() => this.state.fadeOutOpacity.setValue(1));
        this.getTime();
        this.prizeMessage();
        this.refresh();
        setTimeout(() => {
            this.setState({
                visibleSwiper: true
            })
        }, 500)
    }

    changed_status = (item) => {
        let rules = this.state.rule_lists;
        const {today_invite_times, invite_limit_times, today_share_times, share_limit_times} = this.state.task_count;
        if (item.name === '游戏分享') {
            if (today_share_times === share_limit_times) {
                rules[1].status = '已完成'
            } else {
                rules[1].status = '未完成';
                this.setState({
                    rule_show: true
                });
                const {activity_id} = this.state.task_count;
                getActivityInfo({id: activity_id}, data => {
                    console.log("activity_detail", data)
                    const {title, description, intro, banner, id} = data;
                    // uShareActivity(title, description, banner, id);
                    let param = {
                        shareTitle: title,
                        shareText: shareTxt(intro),
                        shareImage: getShareIcon(banner),
                        shareLink: shareHost() + "activities/" + id,
                    };

                    this.setState({
                        shareParam: param,
                        showShare: true,
                        showInviteShare: false,
                        rule_lists: rules
                    })

                }, err => {

                })


            }
        } else if (item.name === '好友邀请') {
            if (today_invite_times === invite_limit_times) {
                rules[2].status = '已完成'
            } else {
                rules[2].status = '未完成';
                logMsg("进入邀请分享")
                this.setState({
                    rule_show: true
                });
                let param = {
                    shareTitle: '【澳门旅行APP】下载后免费抽奖，最高可获得iPhone XS！',
                    shareText: '在这里，可以随时随地找美食、定酒店！更有幸运大转盘——百万大奖等你拿！',
                    shareImage: shareIcon,
                    shareLink: shareHost() + "invite_load?id=" + this.getUserId()
                };

                this.setState({
                    shareParam_invite: param,
                    showInviteShare: true,
                    showShare: false,
                    rule_lists: rules
                })
            }
        }
    };


    getUserId = () => {
        if (!isEmptyObject(global.login_user) && strNotNull(global.login_user.user_id)) {
            return login_user.user_id;
        }
        return '0';
    }

    getTime = () => {
        getWheelTime(data => {
            logMsg("抽奖次数", data)
            this.setState({
                wheel_times: data.wheel_remain_times
            })
        })
    };

    prizeMessage = () => {
        //用户中奖轮播
        getprizeMessages(data => {
            logMsg("中奖轮播", data);
            this.setState({
                prize_messages: data.items
            })
        })
    }

    refresh = () => {
        getElements(data => {
            logMsg("转盘元素：", data);
            this.setState({
                drawData: data
            })
        });

        if (!isEmptyObject(global.login_user)) {
            getTaskCount(data => {
                console.log("我的积分", data)
                let rules = [...this.state.rule_lists];
                const {today_invite_times, invite_limit_times, today_share_times, share_limit_times} = data;
                if (today_invite_times === invite_limit_times) {
                    rules[2].status = '已完成'
                } else {
                    rules[2].status = '未完成'
                }
                if (today_share_times === share_limit_times) {
                    rules[1].status = '已完成'
                } else {
                    rules[1].status = '未完成'
                }
                this.setState({
                    task_count: data,
                    rule_lists: rules
                })

            }, err => {
                console.log("err", err)
            })
        }


    }
    toggle2 = () => {
        if (!isEmptyObject(global.login_user)) {
            this.setState({
                visible: !this.state.visible
            })
        }
    }

    toggle = () => {
        if (this.state.offOn)
            this.setState({
                visible: !this.state.visible
            })
    };

    rotateImg = (prize_counts) => {
        if (this.state.offOn && this.state.wheel_times > 0) {
            postLottery({}, data => {
                logMsg("抽奖的ID", data)
                this.rotateImg1(data, prize_counts)

            }, err => {

                logMsg("抽奖问题", err)
            });


        }
    };


    rotateImg1 = (lottery, prize_counts) => {


        //转盘中奖品个数
        let COUNT = prize_counts;

        //获取抽奖位置
        let wheels = this.state.drawData.items.filter(item => item.id === lottery.wheel_element_id)
        logMsg('获奖位置', wheels)
        if (wheels.length === 1) {

            let number = wheels[0].position
            this.setState({
                offOn: !this.state.offOn,
            });

            let oneTimeRotate = number / COUNT + 3;
            Animated.timing(this.state.rotateDeg, {
                toValue: oneTimeRotate,
                duration: 5000,
                easing: Easing.out(Easing.quad)
            }).start(() => {

                this.setState({
                    offOn: !this.state.offOn,
                    rotateDeg: new Animated.Value(0)
                });
                //动画结束时，会把toValue值，回调给callback
                this.state.rotateDeg.stopAnimation(() => {
                    if (lottery.name === '谢谢参与') {
                        Alert.alert('澳门旅行', `很遗憾没有抽中，谢谢参与`, [{
                            text: `知道了`, onPress: () => {

                            }
                        }])
                    } else if (lottery.name.indexOf('积分') !== -1) {
                        Alert.alert('澳门旅行', `恭喜您获得${lottery.name}`, [{
                            text: `知道了`, onPress: () => {

                            }
                        }])
                    } else {
                        alertLotteryOrder('澳门旅行', `恭喜您抽中${lottery.name}，请前往我的奖品查看领取`, () => {
                            this.toggle();
                            global.router.toMyWardsPage()
                        })
                    }
                })

                //刷新次数
                this.getTime();
                //轮播
                this.prizeMessage();
            });
        }

    };


    _background = (item) => {
        let action = item.status;
        if (action === '完成' || action === '已完成') {
            return '#6CC7FF'
        } else if (action === '未完成') {
            return '#FF6B4C'
        } else {
            return "#FF6B4C"
        }
    };

    judge = (task) => {
        if (strNotNull(task)) {
            return task;
        } else {
            return ''
        }
    };

    showContent = (name) => {
        const {today_invite_times, invite_limit_times, today_share_times, share_limit_times} = this.state.task_count;
        if (name === '好友邀请') {
            return <Text style={{
                color: '#444444',
                fontSize: 14
            }}>{`(${this.judge(today_invite_times)}/${this.judge(invite_limit_times)})`}</Text>
        } else if (name === '游戏分享') {
            return <Text style={{
                color: '#444444',
                fontSize: 14
            }}>{`(${this.judge(today_share_times)}/${this.judge(share_limit_times)})`}</Text>
        } else {
            return null;
        }
    };

    showDes = (item) => {
        const {invite_limit_times, share_limit_times} = this.state.task_count;
        if (item.name === '好友邀请') {
            return <Text
                style={{color: '#AAAAAA', fontSize: 12, marginTop: 3}}>{`好友完成新手任务后,抽奖次数+1`}</Text>
        } else {
            return <Text style={{color: '#AAAAAA', fontSize: 12, marginTop: 3}}>{item.des}</Text>
        }
    };


    content_show() {
        if (this.state.rule_show) {
            const {total_points, invite_limit_times, share_limit_times, today_invite_times} = this.state.task_count;
            return (
                <View style={{
                    width: Metrics.screenWidth - 34,
                    paddingBottom: 40,
                    backgroundColor: '#FFFFFF',
                    borderColor: '#6787EE',
                    borderWidth: 3,
                    borderRadius: 10,
                    marginTop: 10,
                    paddingTop: 30
                }}>
                    <View style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
                        <View style={{flex: 1, marginLeft: 17}}/>
                        <Text style={{
                            color: '#1E41B2',
                            fontSize: 18,
                            alignSelf: 'center',
                            fontWeight: 'bold'
                        }}>活动任务</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                rule_show: false
                            })
                        }}>
                            <Image source={Images.lottery.rule_close} style={{marginRight: 23, width: 18, height: 18}}/>
                        </TouchableOpacity>
                    </View>

                    {this.state.rule_lists.map((item, index) => {
                        return (
                            <View key={index} style={{flexDirection: 'column', alignItems: 'center'}}>
                                <View style={styles.item} key={index}>
                                    <Image style={{height: 34, width: 34}}
                                           source={item.image}/>
                                    <View style={{marginLeft: 14, flexDirection: 'column'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{
                                                color: '#444444',
                                                fontSize: 14,
                                                marginRight: 3
                                            }}>{item.name}</Text>
                                            {this.showContent(item.name)}
                                        </View>
                                        {this.showDes(item)}

                                    </View>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[styles.statusView, {backgroundColor: this._background(item)}]}
                                        onPress={() => {
                                            if (item.status === '兑换') {
                                                if (total_points < 200) {
                                                    Alert.alert('澳门旅行', '积分不足')
                                                } else {
                                                    alertOrder("确认兑换？", () => {
                                                        postWheelTimes({}, data => {
                                                            logMsg("积分兑换", data);
                                                            Alert.alert('澳门旅行', '积分兑换成功');
                                                            this.getTime();
                                                            if (this.refresh)
                                                                this.refresh();
                                                        }, err => {
                                                            logMsg("积分兑换err", err)
                                                        })
                                                    });
                                                }

                                            } else {
                                                this.changed_status(item)
                                            }
                                        }}>
                                        <Text style={{color: '#FFFFFF', fontSize: 14}}>{item.status}</Text>
                                    </TouchableOpacity>
                                </View>

                                {index === rule_list.length - 1 ? <Text style={{
                                    color: '#AAAAAA', fontSize: 12, marginTop: 2, alignSelf: 'flex-end',
                                    marginRight: 23
                                }}>
                                    {`当前积分：${this.judge(total_points)}`}
                                </Text> : null}
                                <View style={{
                                    height: 1,
                                    width: '90%',
                                    alignSelf: 'center',
                                    backgroundColor: '#F3F3F3',
                                    marginTop: 5
                                }}/>
                            </View>
                        )
                    })}

                    {/*<Text style={{color: '#444444', fontSize: 14, marginTop: 20, marginLeft: 23}}>活动规则</Text>*/}
                    {/*{prompts.map((prompt, index) => {*/}
                    {/*return <Text key={index} style={{*/}
                    {/*color: '#666666',*/}
                    {/*fontSize: 14,*/}
                    {/*marginTop: 5,*/}
                    {/*marginLeft: 23*/}
                    {/*}}>{prompt}</Text>*/}
                    {/*})}*/}

                </View>
            )
        } else {
            const {wheel_image, prize_counts} = this.state.drawData
            if (isEmptyObject(this.state.drawData)) {
                return (
                    <TouchableOpacity onPress={() => {
                        if (this.state.offOn)
                            this.setState({
                                visible: false
                            })
                    }}
                                      style={{
                                          position: 'absolute',
                                          top: 30,
                                          right: 25,
                                          zIndex: 999
                                      }}>
                        <Image source={require('./imgs/lottery_close.png')} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                )
            }
            if (wheel_image)
                return (
                    <View style={{marginTop: -5}}>
                        <Image source={require('./imgs/turntable.png')}
                               style={{width: 200, height: 150, alignSelf: 'center', zIndex: 1000}}/>
                        <ImageBackground source={require('./imgs/circle_bg.png')} style={{
                            height: 340, width: 340, marginTop: -50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>


                            <View style={styles.lottery_container}>
                                <Animated.View style={[styles.mainImg, {
                                    transform: [{
                                        rotate: this.state.rotateDeg.interpolate({
                                            inputRange: [0, 4],
                                            outputRange: ['0deg', '1440deg']
                                        })
                                    }]
                                }]}>
                                    <Image
                                        style={{position: "absolute", height: 300, width: 300, resizeMode: 'stretch'}}
                                        source={{uri: wheel_image}}/>

                                </Animated.View>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                                    if (isEmptyObject(global.login_user)) {
                                        global.router.toLoginFirstPage()
                                    } else {
                                        if (prize_counts)
                                            this.rotateImg(prize_counts)
                                    }
                                }} style={styles.centerPoint}>
                                    <Image source={require('./imgs/point_new.png')}
                                           style={{
                                               height: 80,
                                               width: 63.4, resizeMode: "stretch", position: "absolute"
                                           }}/>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                        <TouchableOpacity onPress={() => {
                            if (this.state.offOn)
                                this.setState({
                                    visible: false
                                })
                        }}
                                          style={{
                                              position: 'absolute',
                                              top: 30,
                                              right: 25,
                                              zIndex: 999
                                          }}>
                            <Image source={require('./imgs/lottery_close.png')} style={{width: 30, height: 30}}/>
                        </TouchableOpacity>
                    </View>
                )
        }
    }


    render() {
        const {showShare, shareParam, shareParam_invite, drawData, showInviteShare} = this.state;
        const {shareTitle, shareText, shareImage, shareLink} = shareParam
        if (isEmptyObject(drawData)) {
            return (
                <View/>
            )
        }
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                onRequestClose={() => {

                }}
                visible={this.state.visible}
                style={{alignItems: 'center'}}
            >
                <Animated.View style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    opacity: this.state.fadeOutOpacity
                }}>
                    <View style={{marginTop: Metrics.reallySize(40), alignItems: 'center'}}>
                        {this.carousel()}

                        {this.content_show()}
                    </View>


                    <View style={{marginTop: Metrics.reallySize(20),flexDirection:'column',alignItems:'center'}}>
                        <View style={{
                            alignSelf: 'center',
                            paddingLeft: 10,
                            width: 150,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <ImageBackground
                                source={Images.lottery.opportunity}
                                style={{width: 120, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>{`${this.state.wheel_times < 0 ? 0 : this.state.wheel_times}次机会`}</Text>
                            </ImageBackground>
                            <TouchableOpacity style={{position: 'absolute', right: 10}}
                                              onPress={() => {
                                                  if (this.state.offOn) {
                                                      this.refresh();
                                                      this.getTime();
                                                      this.setState({
                                                          rule_show: true
                                                      })
                                                  }
                                              }}>
                                <Image style={{width: 30, height: 30}} source={Images.lottery.ward_add}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            width:220,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <TouchableOpacity onPress={() => {
                                if (this.state.offOn) {
                                    this.toggle();
                                    global.router.toGameRulesPage(this.toggle)
                                }
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    color: '#85b0ff',
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: "solid",
                                    textDecorationColor: "#6787EE"
                                }}>游戏规则></Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (this.state.offOn) {
                                    this.toggle();
                                    global.router.toWinListPage(this.toggle)
                                }
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    color: '#29d2e1',
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: "solid",
                                    textDecorationColor: "#6787EE"
                                }}>往期中奖></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {showShare && !showInviteShare ? <ShareView hiddenShareAction={() => {
                    this.setState({
                        showShare: false
                    })
                }}
                                                            shareClick={() => {
                                                                //点击分享回调
                                                                postShareCount({from: 'wheel'}, data => {
                                                                    logMsg("用户好友分享成功:")
                                                                    setTimeout(()=>{
                                                                        this.refresh();
                                                                        this.getTime();
                                                                    },1000)
                                                                }, err => {

                                                                })
                                                            }}
                                                            shareTitle={shareTitle}
                                                            shareText={shareText}
                                                            shareLink={shareLink}
                                                            shareImage={shareImage}/> : null}
                {showInviteShare && !showShare ? <ShareView hiddenShareAction={() => {
                    this.setState({
                        showInviteShare: false
                    })
                }}
                                                            shareClick={() => {
                                                                //点击分享回调
                                                                postShareCount({from: 'wheel'}, data => {
                                                                    logMsg("用户邀请分享成功:")
                                                                    setTimeout(()=>{
                                                                        this.refresh();
                                                                        this.getTime();
                                                                    },1000)
                                                                }, err => {

                                                                })
                                                            }}
                                                            shareTitle={shareParam_invite.shareTitle}
                                                            shareText={shareParam_invite.shareText}
                                                            shareLink={shareParam_invite.shareLink}
                                                            shareImage={shareParam_invite.shareImage}/> : null}
            </Modal>
        );
    }

    carousel = () => {
        const {prize_messages} = this.state;
        if (!isEmptyObject(prize_messages) && prize_messages.length > 0)
            return (
                <View style={{
                    height: 24,
                    backgroundColor: 'rgba(0, 0, 0,0.59)',
                    width: Metrics.screenWidth,
                    zIndex: 999
                }}>
                    {this.state.visibleSwiper ? <Swiper
                        containerStyle={{width: Metrics.screenWidth, height: 24}}
                        dotStyle={{width: 0, height: 0}}
                        activeDotStyle={{width: 0, height: 0}}
                        showsButtons={false}
                        autoplayTimeout={3}
                        autoplay={true}
                        removeClippedSubviews={false}>
                        {prize_messages.map((item, key) => {
                            return <View key={key} style={{
                                flexDirection: 'row',
                                width: Metrics.screenWidth,
                                height: 24,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text numberOfLines={1} style={{
                                    color: '#F3F3F3',
                                    fontSize: 12,
                                    alignSelf: 'center',
                                    width: '80%'
                                }}>{`恭喜用户${item.nick_name}转盘活动抽奖获得${item.prize}`}</Text>
                            </View>
                        })}


                    </Swiper> : null}

                </View>


            );
    }


}


const styles = StyleSheet.create({
    lottery_container: {
        width: 300,
        height: 300,
        alignItems: 'center'
    },
    imgPoint: {
        width: 100,
        height: 100,
    },
    centerPoint: {
        position: 'absolute',
        left: 300 / 2 - 62.25,
        top: 72.5,
        zIndex: 100,
        height: 157,
        width: 124.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainImg: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    statusView: {
        width: 68, height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        marginTop: 12,
        marginBottom: 13,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 17, marginLeft: 17
    }
});