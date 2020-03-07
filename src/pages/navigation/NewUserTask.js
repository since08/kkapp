import React, {PureComponent, Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, Modal
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {display_check, invite_count, novice_task, user_invite, wallet_account} from "../../services/WallDao";
import {getDispatchAction, showToast, strNotNull, uShareRegistered} from "../../utils/ComonHelper";
import Router from "../../configs/Router";
import {GET_PROFILE} from "../../actions/ActionTypes";

export default class NewUserTask extends Component {

    state = {
        user_task: {},
        visible: false
    };

    componentDidMount() {
        this.refresh()

    }

    refresh = () => {
        novice_task({}, data => {
            console.log("新手红包任务进度：", data)
            this.setState({
                user_task: data
            })
        }, err => {
            getDispatchAction()['GET_PROFILE']();
            this.props.params.refresh();
            showToast("新手任务已完成")
            router.pop();
        })
    };


    render() {
        const {user_task} = this.state;
        let {login_days, login_days_required, share_count, share_count_required} = user_task;
        login_days = strNotNull(login_days) ? login_days : 0;
        login_days_required = strNotNull(login_days_required) ? login_days_required : 0;
        share_count = strNotNull(share_count) ? share_count : 0;
        share_count_required = strNotNull(share_count_required) ? share_count_required : 0;
        return (
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <ImageBackground style={{width: Metrics.screenWidth, height: 313}}
                                 source={Images.new_user_task}>
                    <NavigationBar
                        title=""
                        leftBtnIcon={Images.task_close}
                        leftImageStyle={{height: 13, width: 13, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => router.pop()}
                    />
                </ImageBackground>


                <View style={styles.task_view}>
                    <Image style={styles.img44}
                           source={Images.integral.login}/>
                    <Text
                        style={styles.text44}>{`登录满${login_days_required}天（${login_days >= login_days_required ? login_days_required : login_days}/${login_days_required}）`}</Text>
                    <View style={{flex: 1}}/>
                    {login_days > 0 && login_days >= login_days_required ? <Image style={styles.img45}
                                                                                  source={Images.right2}/> : null}
                </View>
                <View style={styles.task_view}>
                    <Image style={styles.img44}
                           source={Images.integral.share}/>
                    <Text
                        style={styles.text44}>{`分享（${share_count >= share_count_required ? share_count_required : share_count}/${share_count_required}）`}</Text>
                    <View style={{flex: 1}}/>
                    {share_count > 0 && share_count >= share_count_required ? <Image style={styles.img45}
                                                                                     source={Images.right2}/> : null}
                    {share_count < share_count_required ? <TouchableOpacity
                        style={{
                            width: 68, height: 30,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center', backgroundColor: '#FF6B4C'
                        }}
                        onPress={() => {
                            uShareRegistered();
                        }}>
                        <Text style={{color: '#FFFFFF', fontSize: 14}}>分享</Text>
                    </TouchableOpacity> : null}
                </View>

                <View style={{marginLeft: 17, marginRight: 17, marginTop: 18}}>
                    <Text style={styles.txt57}>
                        活动规则：
                    </Text>
                    <Text style={[styles.txt57, {marginTop: 5}]}>
                        {`新用户注册以后完成登录满${login_days_required}天并分享2次澳门旅行`}
                    </Text>
                    <Text style={styles.txt57}>
                        APP下载任务即可随机获得最高888元现金或积分奖励
                    </Text>
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    txt57: {
        color: "#666666",
        fontSize: 14,
        lineHeight: 20
    },
    img44: {
        width: Metrics.reallySize(34),
        height: Metrics.reallySize(34),
        marginRight: 14
    },
    img45: {
        width: Metrics.reallySize(28),
        height: Metrics.reallySize(20)
    },
    text44: {
        color: "#444444",
        fontSize: 14
    },
    task_view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 12,
        marginLeft: 17,
        marginRight: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3'
    }
})