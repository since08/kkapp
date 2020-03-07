import React, {Component} from 'react';
import {
    AppRegistry,ScrollView,
    StyleSheet,Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {NavigationBar} from '../../components';

const rules = ['1.新人首次登陆即可获得3次机会','2.每日登陆，获得2次机会','3.每日游戏分享，可获得1次机会',
'4.每成功邀请1位朋友，可获得1次抽奖机会','5.每200积分可购买1次机会',
    '6.如发现存在任何作弊或者恶意刷奖行为，官方将有权取消该用户参与资格','7.本次活动最终解释权归"澳门旅行 APP"所有。'];

const prompts = ['1.完成每日任务，最高每日可获得45积分','2.成功购买商城现金商品，可获得等额积分',
    '3.转盘小游戏还有赢取积分的机会哦～'];

const game_rules = ['1.奖品将从抽中后当天算起，有效期为期1个月。',
    '2.请点击“我的”-头像-地址，完善地址部分，避免耽误实体物件的寄件，周末以及节假日不发货。',
    '3.现金奖可在钱包内查询金额，提现需要3个工作日，节假日顺延。',
    '4.餐券仅限凼仔威尼斯人美食广场，详细请联系客服。',
    '5.双人旅行套餐将随机抽选双人船票、双人澳门塔自助餐或双人星级酒店一份，兑奖时，请提前三天和客服预约（不能预约当天），按要求提供相关信息。',
    '6.中奖后需完成客服提示的相应任务，即可完成整个兑奖过程。',
    '7.如有疑问其他，请自行联系客服咨询。',
    '8.如发现存在任何作弊或者恶意刷奖行为，官方将有权取消该用户参与资格。',
    '9.本次活动最终解释权归"澳门旅行 APP"所有。']
export default class IntegralPage extends Component {
    render(){
        return(
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    barStyle={'dark-content'}
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: 'white'}}
                    title={'活动规则'}
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        this.props.params.toggle()
                        router.pop();
                    }}/>

                <ScrollView style={styles.rulesView}>
                    <View style={styles.rules}>
                        <Text style={styles.txt1}>活动规则</Text>
                        {rules.map((item, index) => {
                            return <Text key={index} style={[styles.txt2,{marginTop:6}]}>{item}</Text>
                        })}

                        <Text style={[styles.txt1,{marginTop:17}]}>兑奖规则</Text>

                        {game_rules.map((rule,index)=>{
                            return <Text style={[styles.txt2,{marginTop:3}]} key={index}>{rule}</Text>
                        })}

                        <Text style={[styles.txt1,{marginTop:17}]}>获得积分小提示</Text>
                        {prompts.map((item, index) => {
                            return <Text key={index} style={[styles.txt2,{marginTop:6}]}>{item}</Text>
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

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
        marginTop:21,
        paddingBottom:50
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