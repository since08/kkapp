import React, {Component} from 'react';
import {
    AppRegistry, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {NavigationBar} from '../../components';
import {getActivities, getJmessageInfo, getPrizes_info} from "../../services/AccountDao";
import {isEmptyObject, logMsg, showToast, strNotNull} from "../../utils/ComonHelper";
import I18n from '../../I18n/I18n';
import {visit_other} from "../../services/SocialDao";
import {UltimateListView} from "../../components";
import {LoadErrorView, NoDataView} from '../../components/load';
import RenderHtml from '../comm/RenderHtml';
import {LeftAlignedImage} from "../../components/LeftAlignedImage";
import {getApiType} from "../../services/RequestHelper";

export default class WardReceivePage extends Component {

    state = {
        prize_info: {}
    }

    componentDidMount() {
        const {prize, created_at, id, expired, prize_img} = this.props.params.item;
        getPrizes_info({prize_id: id}, data => {
            logMsg("奖品详情：", data);
            this.setState({
                prize_info: data
            })
        })
    }

    getImUser = () => {
        // this.loading && this.loading.open();

        const user_id = (getApiType() === 'test') ? '5c8cb559463ddb3a1395fc9063ae54d5' : 'fd433a53b54c0a4f21a8c07e73f43a0c';
        ///获取私信用户的用户名
        visit_other({userId: user_id}, (user) => {

            // this.loading && this.loading.close();
            router.toMessageList({
                username: user.username,
                nickname: user.nickname,
                avatarThumbPath: user.avatar,
            });
        }, (error) => {
            showToast(I18n.t("error_alert"));
            this.loading && this.loading.close();
        });
    };

    render() {
        const {prize, created_at, id, expired, prize_img, description} = this.state.prize_info;
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    barStyle={'dark-content'}
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: 'white'}}
                    title={'领取奖品'}
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        router.pop();
                    }}
                    rightBtnIcon={Images.lottery.cus_service}
                    rightImageStyle={{width: 26, height: 22, marginRight: 17}}
                    rightBtnPress={() => {
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
                    }}/>
                <ScrollView style={{paddingTop: 14, marginTop: 1, backgroundColor: 'white'}}>
                    <Text style={{
                        lineHeight: 20,
                        color: '#444444',
                        fontSize: 14,
                        marginTop: 3,
                        marginLeft: 17,
                        marginRight: 17
                    }}>请联系客服领取奖品</Text>
                    {strNotNull(prize_img) ? <View style={{
                        marginLeft: Metrics.reallySize(17),
                        marginRight: Metrics.reallySize(17),
                        marginTop: 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <LeftAlignedImage source={{uri: prize_img}}/>
                        {/*<Image source={{uri:prize_img}} style={{alignSelf:'center',width:'100%'}}/>*/}
                    </View> : null}
                    <Text style={{
                        color: '#444444',
                        fontSize: 18,
                        marginTop: 15,
                        marginLeft: 17,
                        marginRight: 17,
                        marginBottom: 10
                    }}>兑奖规则</Text>
                    <View style={{
                        backgroundColor: 'white',
                        alignItems: 'center',
                        marginLeft: 17,
                        marginRight: 17,
                        paddingBottom: 70
                    }}>
                        <RenderHtml
                            html={description}/>
                    </View>
                </ScrollView>

            </View>
        )
    }
}