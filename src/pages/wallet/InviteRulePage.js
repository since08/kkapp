import React, {Component} from 'react';
import {
    AppRegistry,ScrollView,
    StyleSheet,Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {NavigationBar} from '../../components';

const invite_rules="活动期间分享链接给好友，好友成功注册成为澳门旅行新用户并完成首日任务，即可获取红包。 好友完成7天新手任务或通过澳门旅行APP在线支付完成首单，不论是否使用优惠券，你即可获得推广现金奖励。 奖励实时到账，右下角我的页面“我的钱包”查看。 ";
const withdraw_rules="推广奖金可以在线购买商城商品消费或提现至银行卡 每月（自然月）提现到银行卡总额不得超过1000元人民币：超过1000元人民币部分可下月提取。 单笔提现上限1000元人民币，单笔提现下线50元人民币 ";
const obtains = ["A.同一设备号","B.同一支付账号","C.统一登录账号","D.同一手机号算同一用户"];

export default class InviteRulePage extends Component {

    render() {
        return(
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={'活动规则'}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <ScrollView style={styles.rulesView}>
                    <View style={styles.rules}>
                        <Text style={styles.txt1}>活动规则</Text>
                        <Text style={styles.txt2}>{invite_rules}</Text>
                        <Text style={[styles.txt1,{marginTop:31}]}>现金提现规则</Text>
                        <Text style={styles.txt2}>{withdraw_rules}</Text>

                        <Text style={[styles.txt1,{marginTop:31}]}>注意事项</Text>
                        <Text style={[styles.txt2,{marginTop:11}]}>符合以下条件之一，视为同一账户：</Text>
                        {obtains.map((item, index) => {
                            return <Text key={index} style={[styles.txt2,{lineHeight:20}]}>{item}</Text>
                        })}

                        <Text style={styles.txt2}>若发现作弊行为，澳门旅行有权取消奖励，澳门旅行享有本活动的最终解释权</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }

};
const styles = StyleSheet.create({
    nav: {
        height: Metrics.navBarHeight,
        width: '100%',
        backgroundColor: Colors._E54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Metrics.statusBarHeight
    },
    cancel: {
        fontSize: 14,
        color: Colors.white
    },
    title: {
        fontSize: 18,
        color: Colors.white
    },
    btn_search: {
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rulesView:{
        backgroundColor:'#F2F2F2'
    },
    rules:{
        flex:1,
        paddingRight:15,
        paddingLeft:17,
        marginTop:21
    },
    txt1:{
        color:'#444444',
        fontSize:18,
        fontWeight:'bold'
    },
    txt2:{
        color:'#666666',
        fontSize:14,
        marginTop:12,
        lineHeight:20
    }
});