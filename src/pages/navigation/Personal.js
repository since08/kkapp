import React, {Component} from 'react';
import {
    TouchableOpacity, ScrollView,
    StyleSheet, Platform,
    Text, Image,
    View, SafeAreaView
} from 'react-native';
import {Images, Colors, Metrics, ApplicationStyles} from '../../Themes';
import {
    strNotNull, isEmptyObject, getLoginUser, getUserData, getDispatchAction,
    showToast
} from '../../utils/ComonHelper';
import {umengEvent} from '../../utils/UmengEvent';
import I18n from '../../I18n/I18n';
import JpushHelp from '../../services/JpushHelper';
import {connect} from 'react-redux';
import {FETCH_SUCCESS, GET_PROFILE, GET_UNREAND_MSG} from '../../actions/ActionTypes';
import HotelOrderPage from "../macau/hotelOrder/HotelOrderPage";
import {wallet_account, display_check, novice_task} from '../../services/WallDao';
import {NavigationBar} from '../../components';
import NewUserTask from "./NewUserTask";
import {getJmessageInfo} from "../../services/AccountDao";
import {visit_other} from "../../services/SocialDao";
import {getApiType} from "../../services/RequestHelper";

class Personal extends Component {

    state = {
        viewRef: 0,
        total_account: '0.0',
        display_check: false
    };


    componentDidMount() {
        this._loadUserParams(this.props)
    }


    _loadUserParams = (props) => {
        if (!isEmptyObject(props.profile)) {
            this.refresh()

        } else {
            this.setState({
                total_account: '0.0',
                display_check: false
            })
        }
    };

    refresh = () => {
        wallet_account(data => {
            console.log("个人页面钱包：", data)
            this.setState({
                total_account: data.total_account
            })
        })

        display_check(data => {
            console.log("是否显示我的邀请：", data)
            this.setState({
                display_check: data.display
            })
        });
    };

    componentWillReceiveProps(newProps) {


        if (newProps.actionType === 'GET_PROFILE' && newProps.hasData !== this.props.hasData) {
            this._loadUserParams(newProps)
        }


    }

    _unReadMsg = () => {
        if (!isEmptyObject(global.login_user))
            getDispatchAction()[GET_UNREAND_MSG]()
    };


    render() {
        return (
            <View style={{flex: 1}}>
                {this.readerMe()}

                {this.renderItem()}

                {this.props.profile && this.props.profile.new_user ?
                    <TouchableOpacity style={{position: 'absolute', bottom: 20, right: 17}}
                                      onPress={() => {
                                          router.toNewUserTask(this.refresh)
                                      }}>
                        <Image style={{
                            width: Metrics.reallySize(53),
                            height: Metrics.reallySize(49)
                        }}
                               source={Images.lucky_bag}/>
                    </TouchableOpacity> : null}


            </View>
        )
    }


    renderItem = () => {
        return <ScrollView>
            {/*<View style={stylesP.orderView}>*/}
            {/*<TouchableOpacity*/}
            {/*activeOpacity={1}*/}
            {/*onPress={() => {*/}
            {/*umengEvent('more_order');*/}
            {/*if (strNotNull(getLoginUser().user_id))*/}
            {/*global.router.toOrderListPage();*/}
            {/*else*/}
            {/*global.router.toLoginFirstPage()*/}
            {/*}}*/}
            {/*style={stylesP.btnOrder}>*/}
            {/*<Image style={stylesP.imgOrder1}*/}
            {/*source={Images.ticket_order}/>*/}
            {/*<Text style={stylesP.txtProfile1}>{I18n.t('ticket_order')}</Text>*/}
            {/*</TouchableOpacity>*/}
            {/*<View style={{width: 1, backgroundColor: Colors._ECE, marginBottom: 5, marginTop: 5}}/>*/}
            {/*<TouchableOpacity style={stylesP.btnOrder}*/}
            {/*activeOpacity={1}*/}
            {/*onPress={() => {*/}
            {/*if (strNotNull(getLoginUser().user_id))*/}
            {/*global.router.toMallOrderPage();*/}
            {/*else*/}
            {/*global.router.toLoginFirstPage();*/}
            {/*}}>*/}
            {/*<Image style={stylesP.imgOrder2}*/}
            {/*source={Images.mall_order}/>*/}
            {/*<Text style={stylesP.txtProfile1}>{I18n.t('mall_order')}</Text>*/}
            {/*</TouchableOpacity>*/}

            {/*</View>*/}

            <View style={{height: 5, width: '100%'}}/>
            {this._item(stylesP.item_view, Images.social.mine_moment, stylesP.img_dy,
                '我的朋友圈', () => {
                    if (isEmptyObject(login_user)) {
                        router.toLoginFirstPage()
                    } else {
                        router.toPersonDynamic(login_user)
                    }

                })}
            <View style={{height: 5, width: '100%'}}/>

            {/*<View style={{height: 3, width: '100%'}}/>*/}
            {/*{this._item(stylesP.item_view, Images.crowd, stylesP.img_dy,*/}
            {/*I18n.t('sponsored'), () => {*/}
            {/*if (isEmptyObject(global.login_user))*/}
            {/*global.router.toLoginFirstPage()*/}
            {/*else*/}
            {/*global.router.toRecordList()*/}

            {/*})}*/}
            <View style={{height: 1, marginLeft: 69}}/>
            {this._item(stylesP.item_view, Images.integral.hotel, stylesP.img_dy, '酒店订单', () => {
                if (isEmptyObject(global.login_user))
                    global.router.toLoginFirstPage()
                else
                    global.router.toHotelOrderPage()

            })}
            <View style={{height: 1, marginLeft: 69}}/>
            {this._item(stylesP.item_view, Images.mall_order_icon, stylesP.img_dy, '商城订单', () => {
                if (isEmptyObject(global.login_user))
                    global.router.toLoginFirstPage()
                else
                    global.router.toMallOrderPage()

            })}

            <View style={{height: 1, marginLeft: 69}}/>
            {this._item(stylesP.item_view, Images.integral.integral, stylesP.img_dy, '我的积分', () => {
                if (isEmptyObject(global.login_user))
                    global.router.toLoginFirstPage()
                else
                    global.router.toIntegralPage(this.props.profile.total_points)

            })}

            <View style={{height: 1, marginLeft: 69}}/>
            {this._item(stylesP.item_view, Images.coupon.coupon, stylesP.img_dy, '我的优惠券', () => {
                if (isEmptyObject(global.login_user))
                    global.router.toLoginFirstPage()
                else
                    global.router.toCouponPage()

            })}


            <View style={{height: 15, width: '100%'}}/>

            {/*{this._item(stylesP.item_view, Images.business, {width: 21, height: 22, marginLeft: 20},*/}
            {/*'商务合作', () => {*/}
            {/*umengEvent('more_business');*/}
            {/*router.toBusinessPage()*/}

            {/*})}*/}

            {this._item(stylesP.item_view, Images.business, {width: 21, height: 22, marginLeft: 20},
                '钱包', () => {
                    if (isEmptyObject(global.login_user))
                        global.router.toLoginFirstPage()
                    else
                        global.router.toWalletPage(this.refresh)

                })}
            <View style={{height: 1, width: '100%'}}/>
            {/*{this._item(stylesP.item_view, Images.settings, {width: 23, height: 23, marginLeft: 20},*/}
                {/*I18n.t('setting'), () => {*/}
                    {/*router.toSettingPage()*/}

                {/*})}*/}

            {this._item(stylesP.item_view, Images.my_save, {width: 22, height: 22, marginLeft: 20},
                '收藏', () => {
                    if (isEmptyObject(global.login_user))
                        global.router.toLoginFirstPage()
                    else{
                        global.router.toMySavePage()
                    }

                })}

            <View style={{height: 1, width: '100%'}}/>
            {this._item(stylesP.item_view, Images.callPerson, {width: 23, height: 23, marginLeft: 20},
                '联系客服', () => {

                    if (isEmptyObject(global.login_user))
                        global.router.toLoginFirstPage()
                    else {
                        if (isEmptyObject(global.imUser)) {
                            getJmessageInfo(() => {
                                this.getImUser()
                            })
                        } else {
                            this.getImUser()
                        }
                    }

                })}


            <View style={{height: 1, width: '100%'}}/>

            {this.state.display_check ? this._item(stylesP.item_view, Images.wallet.invite, {
                    width: 23,
                    height: 20,
                    marginLeft: 20
                },
                '我的邀请', () => {
                    if (isEmptyObject(global.login_user))
                        global.router.toLoginFirstPage()
                    else
                        global.router.toInvitePage()

                }) : null}

            <View style={{height: 50}}/>
        </ScrollView>
    };

    getImUser = () => {
        this.loading && this.loading.open();

        const user_id = (getApiType() === 'test') ? '5c8cb559463ddb3a1395fc9063ae54d5' : 'fd433a53b54c0a4f21a8c07e73f43a0c';
        ///获取私信用户的用户名
        visit_other({userId: user_id}, (user) => {

            this.loading && this.loading.close();
            router.toMessageList({
                username: user.username,
                nickname: user.nickname,
                avatarThumbPath: user.avatar,
            });
        }, (error) => {
            showToast(I18n.t("error_alert"));
            this.loading && this.loading.close();
        });
    }

    visitChat = () => {
    };

    _item = (itemStyle, img, imgStyle, title, onPress) => {
        const {profile} = this.props;
        let {total_account} = this.state;
        total_account = (total_account === '0.0' || total_account === '0') ? '0.00' : total_account;
        total_account = isEmptyObject(profile) ? '0.00' : total_account;
        return <TouchableOpacity
            activeOpacity={1}
            style={itemStyle} onPress={onPress}>
            <Image style={imgStyle} source={img}/>
            <Text style={stylesP.personalText}>{title}</Text>
            <View style={{flex: 1}}/>

            {title === '联系客服' && !isEmptyObject(global.login_user) ? <Text
                    style={{
                        width: 130,
                        fontSize: 12,
                        color: '#AAAAAA',
                        marginRight: 12
                    }}>(工作时间：周一至周五10:00 - 18:00)</Text>
                : null}

            {title === '我的邀请' && !isEmptyObject(global.login_user) ? <Text
                    style={{
                        fontSize: 14,
                        color: '#DA8575',
                        marginRight: 12,
                        lineHeight: 22
                    }}>最高可获得88元红包奖励</Text>
                : null}

            {title === '钱包' && !isEmptyObject(global.login_user) ? <Text
                    style={{
                        fontSize: 16,
                        color: '#AAAAAA',
                        marginRight: 12,
                        lineHeight: 22
                    }}>{total_account}</Text>
                : null}

            <Image style={stylesP.personalImg} source={Images.is}/>
        </TouchableOpacity>
    };


    _avatar = () => {
        const {profile} = this.props;
        if (isEmptyObject(profile))
            return Images.home_avatar;
        else if (strNotNull(profile.avatar))
            return {uri: profile.avatar}
        else
            return Images.home_avatar;
    };

    _signature = () => {
        const {profile} = this.props;
        if (profile.signature && strNotNull(profile.signature))
            return profile.signature;
        else
            return I18n.t('ple_sign')
    };


    readerMe = () => {
        const {profile} = this.props;
        const {following_count, followers_count} = profile;
        console.log("person:", profile)
        return <View style={stylesP.meView}>
            <SafeAreaView/>
            <View style={{
                height: Metrics.navBarHeight,
                width: '100%',
                flexDirection: 'row-reverse'
            }}>
                {/*<TouchableOpacity*/}
                    {/*style={{*/}
                        {/*justifyContent: 'center',*/}
                        {/*alignItems: 'center',*/}
                        {/*height: 44*/}
                    {/*}}*/}
                    {/*onPress={this.toMessagePage}>*/}
                    {/*<Image*/}
                        {/*source={this._imgNotice()}*/}
                        {/*style={{*/}
                            {/*height: 22,*/}
                            {/*width: 21,*/}
                            {/*marginRight: 20*/}
                        {/*}}/>*/}

                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 44
                    }}
                    onPress={()=>{
                        global.router.toSettingPage()
                    }}>
                    <Text
                        style={{
                            color:'white',
                            fontSize:16,
                            marginRight: 20
                        }}>设置</Text>

                </TouchableOpacity>

            </View>


            <TouchableOpacity
                activeOpacity={1}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                    if (!isEmptyObject(login_user))
                        router.toPersonPage();
                    else
                        router.toLoginFirstPage()

                }}>
                <View
                    style={stylesP.personRadius2}>
                    <Image style={{width: 72, height: 72, borderRadius: 36}} source={this._avatar()}/>
                </View>

                <View style={{marginLeft: 20, marginRight: 17, width: Metrics.reallySize(248)}}>

                    <Text
                        style={stylesP.personSignature2}>{isEmptyObject(login_user) ? I18n.t('log_register') : profile.nick_name}</Text>
                    <Text style={stylesP.personSignature}>{this._signature()}</Text>

                    <View style={{
                        backgroundColor: '#D62222', height: 1,
                        width: Metrics.reallySize(248),
                        marginTop: 18
                    }}/>

                    {/*关注与粉丝*/}
                    <View style={{height: 49, flexDirection: 'row', alignItems: 'center'}}>

                        <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => {
                                if (isEmptyObject(login_user))
                                    router.toLoginFirstPage()
                                else
                                    router.toSocialContact({
                                        type: 0,
                                        following_count: following_count,
                                        follower_count: followers_count
                                    })
                            }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: 14
                            }}>{`${I18n.t('social.follow')}   ${following_count ? following_count : 0}`}</Text>

                        </TouchableOpacity>
                        <View
                            style={{
                                height: 12,
                                width: 1,
                                backgroundColor: Colors.white,
                                marginLeft: 28,
                                marginRight: 28
                            }}/>

                        <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => {
                                if (isEmptyObject(login_user))
                                    router.toLoginFirstPage()
                                else
                                    router.toSocialContact({
                                        type: 1,
                                        following_count: following_count,
                                        follower_count: followers_count
                                    })
                            }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: 14
                            }}>{`${I18n.t('stalwart')}   ${followers_count ? followers_count : 0}`}</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginRight: 17}}/>
                {/*<Image style={{marginRight: 17, width: 8, height: 15}} source={Images.rightImg}/>*/}
            </TouchableOpacity>


        </View>


    };


    toMessagePage = () => {
        umengEvent('home_notification');
        if (isEmptyObject(login_user)) {
            router.toLoginFirstPage()
        } else {

            JpushHelp.iosSetBadge(0);
            router.toMessageCenter()
        }

    };

    _imgNotice = () => {
        if (!isEmptyObject(this.props.unread)) {
            return this.props.unread.unread_count > 0 ? Images.search_notice2 : Images.search_notice;
        } else
            return Images.search_notice;
    }

}

const stylesP = StyleSheet.create({
    img_dy: {
        width: 23,
        height: 23,
        marginLeft: 20
    },
    item_view: {
        backgroundColor: 'white',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',

    },
    blurImg: {
        height: 260,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    blur: {
        height: 260,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
    },
    personalView: {
        backgroundColor: '#ffffff'
    },
    personalView2: {
        width: Metrics.screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        marginBottom: 13,
    },
    personalViewBusiness: {
        flexDirection: 'row',
    },
    personalView2Img: {
        width: 18,
        height: 22,
        marginLeft: 20
    },
    personalText: {
        fontSize: 16,
        color: '#444444',
        marginLeft: 30
    },
    personalImg: {
        width: Metrics.reallySize(8),
        height: Metrics.reallySize(15),
        marginRight: 18
    },

    personRadius: {
        width: 88,
        height: 88,
        borderRadius: 44,
        marginTop: 30,
        backgroundColor: 'rgba(0,0,0,0.23)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    personRadius2: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 25,
        marginBottom: 54
    },
    personID: {
        fontSize: 12,
        color: '#eeeeee',
        marginBottom: 12,
        marginTop: 8,
        backgroundColor: 'transparent'
    },
    personSignature: {
        fontSize: 13,
        color: Colors.white,
        marginTop: 8,
        backgroundColor: 'transparent'
    },
    personSignature2: {
        fontSize: 17,
        color: Colors.white,
        fontWeight: 'bold',
        marginTop: 8,
        backgroundColor: 'transparent'
    },
    textLine: {
        height: 1,
        width: 67,
        backgroundColor: '#ffffff',

    },
    msgImg: {
        height: 22,
        width: 21,
        marginLeft: 20
    },
    meView: {
        backgroundColor: Colors._E54,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderView: {flexDirection: 'row', height: 82, width: '100%', backgroundColor: 'white'},
    btnOrder: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    imgOrder1: {height: 25, width: 25},
    imgOrder2: {height: 27, width: 30},
    txtProfile1: {
        fontSize: 14,
        color: Colors.txt_444,
        marginTop: 8
    },
    personDynamic: {
        width: Metrics.screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        marginBottom: 13,
    }


});

const bindAction = dispatch => ({});

const mapStateToProps = state => ({
    loading: state.PersonState.loading,
    profile: state.PersonState.profile,
    error: state.PersonState.error,
    hasData: state.PersonState.hasData,
    actionType: state.PersonState.actionType,
    unread: state.AccountState.unread,
    actionType1: state.AccountState.actionType

});

export default connect(mapStateToProps, bindAction)(Personal);
