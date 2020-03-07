import React, {Component} from 'react';
import {
    View, Text, Alert,
    Image, StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Images, Colors, Metrics} from '../../Themes';
import {logMsg} from "../../utils/ComonHelper";
import RoundTripPage from "../fastBtn/RoundTripPage";
import FastFoodPage from "../fastBtn/FastFoodPage";

const catalogs = [{
    name: '天气',
    type: 'weather',
    size: {height: 23, width: 23},
    icon: Images.navigation2.weather
},
    {
        name: '出入境',
        type: 'fast_food',
        size: {height: 20, width: 21},
        icon: Images.navigation2.car_bg
    },
    {
        name: '新闻',
        type: 'round_trip',
        size: {height: 20, width: 21},
        icon: Images.navigation2.ferry_bg
    },
    {
        name: '便民',
        type: 'public_service',
        size: {height: 18, width: 18},
        icon: Images.navigation2.convenient
    }];

const catalogs_two = [{
    name: '攻略',
    type: 'raiders',
    size: {height: 19, width: 19},
    icon: Images.navigation2.raiders_bg
},
    {
        name: '签证',
        type: 'visa',
        size: {height: 19, width: 20},
        icon: Images.navigation2.visa
    },
    {
        name: '优惠',
        type: 'coupon',
        size: {height: 20, width: 20},
        icon: Images.navigation2.coupon_bg
    },
    {
        name: '商城',
        type: 'mall',
        size: {height: 18, width: 18},
        icon: Images.navigation2.mall_bg
    }]

export default class FastBtns extends Component {

    render() {

        return <View style={{
            width: Metrics.screenWidth,
            paddingTop: 17,
            paddingBottom: 17,
            backgroundColor: 'white'
        }}>

            <View style={{
                marginRight:17,
                marginLeft:17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
                {catalogs.map((item, index) => {
                    return <TouchableOpacity
                        key={item.name}
                        onPress={() => {
                            if (item.type === 'weather')
                                router.toWebView('天气', 'http://wx.weather.com.cn/mweather/101330101.shtml#1')
                            else if (item.type === 'fast_food') {
                                router.toWebView('出入境', 'http://www.fsm.gov.mo/psp/pspmonitor/mobile/PortasdoCerco.aspx')
                            } else if (item.type === 'round_trip') {
                                global.router.toHotelSearch({
                                    name: '新闻',
                                    type: 'news',
                                    size: item.size,
                                    icon: item.icon
                                })
                            } else if (item.type === 'public_service') {
                                global.router.toFastFoodPage('public_service')
                            }
                        }}
                        style={{
                            width: '25%',
                            height:30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRightWidth: index === catalogs.length - 1 ? 0 : 1,
                            borderRightColor: '#F3F3F3'
                        }}>
                        <Image style={item.size}
                               source={item.icon}/>

                        <Text style={{
                            fontSize: 14, color: '#444444',marginLeft:8
                        }}>{item.name}</Text>

                    </TouchableOpacity>
                })}
            </View>

            <View style={{
                marginRight:17,
                marginLeft:17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginTop: 16
            }}>
                {catalogs_two.map((item, index) => {
                    return <TouchableOpacity
                        key={item.name}
                        onPress={() => {
                            if (item.type === 'raiders') {
                                global.router.toHotelSearch({
                                    name: '攻略',
                                    type: 'strategy',
                                    size: item.size,
                                    icon: item.icon
                                })
                            } else if (item.type === 'visa') {
                                global.router.toVisaInfoPage()
                            } else if (item.type === 'coupon') {
                                global.router.toHotelSearch({
                                    name: '优惠',
                                    type: 'discounts',
                                    size: item.size,
                                    icon: item.icon
                                })
                            } else if (item.type === 'mall') {
                                global.router.toMallPage()
                            }
                        }}
                        style={{
                            width: '25%',
                            height:30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRightWidth: index === catalogs.length - 1 ? 0 : 1,
                            borderRightColor: '#F3F3F3'
                        }}>
                        {item.type === 'visa' ?
                            <Image style={{width: 28, height: 14, position: 'absolute', bottom:15, left: 10,zIndex:9}}
                                   source={Images.navigation2.tehui}/> : null}
                        <Image style={item.size}
                               source={item.icon}/>

                        <Text style={{
                            fontSize: 14, color: '#444444',marginLeft:8
                        }}>{item.name}</Text>

                    </TouchableOpacity>
                })}
            </View>

        </View>
    }

}