import React, {Component} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import ImageLoad from "../../components/ImageLoad";
import {isEmptyObject, showToast, checkMobile, isWXAppInstalled, payWx, alertOrder, call} from "../../utils/ComonHelper";

export default class ReservationBottom extends Component {

    render() {
        const {order,persons,phone} = this.props;
        return (
            <View style={styles.mallBottom}>
                <Text style={styles.payment}>在线支付：<Text style={{color: "#F24A4A",fontSize: 18}}>¥{order.final_price}</Text></Text>

                <View style={{flex: 1}}/>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingLeft:5,paddingRight:10,paddingTop:5,paddingBottom:5}}
                onPress={()=>{
                    this.props._detailsShow();
                    // this.props.refresh()
                }}>
                    <Text style={{color: "#AAAAAA",fontSize: 12}} >明细</Text>
                    <Image style={{width:10,height:5,marginLeft:6}} source={Images.macau.down}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.orderView}
                    onPress={() => {
                        for(let i =0;i<persons.length;i++){
                            if(persons[i].last_name==='' || persons[i].first_name===''){
                                showToast('入住人不能为空')
                                return;
                            }
                        }

                        if(!checkMobile(phone)){
                            return;
                        }
                        this.props.refresh();


                    }}>
                    <Text style={{color:"#FFFFFF",fontSize:14}}>提交订单</Text>

                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    orderView:{
        width:89,
        height:37,
        backgroundColor:'#F24A4A',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:7,
        paddingBottom:6,
        marginRight:17,
        borderRadius:4
    },
    mallBottom: {
        height: 50,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        zIndex: 999
    },
    payment: {
        marginLeft: 17,
        color: "#333333",
        fontSize: 14
    }
})