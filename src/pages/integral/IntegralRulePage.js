import React, {Component} from 'react';
import {
    AppRegistry,ScrollView,
    StyleSheet,Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {NavigationBar} from '../../components';

const rules="积分是用于澳门旅行用户使用的各种增值服务的种类、数量、或时间等的一种统计代码，不能用于澳门通增值服务以外的任何商品或服务。";
const exchange=['1、积分可用于兑换商品、抵扣券，具体规则以商品上和抵扣券页面上的描述为准','2、积分商品数量有限，兑完为止','3、积分商品不支持退换货','3、确定兑换后，积分将立即扣除。除商品缺货外，兑换使用的积分不予退还。'];
const obtain = '用户可以通过完成「每日奖励任务」来获取积分，点击「我的积分」，即可查看您可参与的「每日奖励任务」，按照任务描述完成制定要求，即可获取积分奖励';

export default class IntegralRulePage extends Component {

    render() {
        return(
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={'积分规则'}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <ScrollView style={styles.rulesView}>
                    <View style={styles.rules}>
                        <Text style={styles.txt1}>什么是积分</Text>
                        <Text style={styles.txt2}>{rules}</Text>
                        <Text style={[styles.txt1,{marginTop:12}]}>积分兑换说明</Text>
                        {exchange.map((item, index) => {
                            return <Text key={index} style={[styles.txt2,{marginTop:12}]}>{item}</Text>
                        })}

                        <Text style={[styles.txt1,{marginTop:17}]}>如何获取积分</Text>
                        <Text style={[styles.txt2,{marginTop:11}]}>{obtain}</Text>
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