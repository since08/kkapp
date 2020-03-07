/**
 * Created by lorne on 2017/2/22.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, Platform
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import {NavigationBar} from '../../../components';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import HotelOrderListStatus from './HotelOrderListStatus';
import {HotelStatus} from "../../../configs/Status";

let menus = [{type: 'all', name: "全部"},
    {type: HotelStatus.unpaid, name: "待付款"},
    {type: HotelStatus.paid, name: "待入住"},
    {type: HotelStatus.completed, name: "已完成"}];

export default class HotelOrderPage extends Component {

    state = {};


    render() {
        return (<View style={[ApplicationStyles.bgContainer, {backgroundColor: '#ECECEE'}]}
                      testID="page_order_list">
            <NavigationBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                toolbarStyle={{backgroundColor: Colors.white}}
                title={"酒店订单"}
                titleStyle={{color: Colors._E54}}
                leftBtnIcon={Images.mall_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}/>

            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar
                    backgroundColor={Colors.white}
                    activeTextColor="#F34A4A"
                    inactiveTextColor={Colors._AAA}
                    textStyle={{fontSize: 15}}
                    tabStyle={{paddingBottom: 0}}
                    style={{borderColor: Colors._EEE, marginTop: 1, height: 44, alignItems: 'center'}}
                    underlineStyle={{backgroundColor: '#F34A4A', width: '12%', height: 2, marginLeft: '4.6%'}}/>}>
                {menus.map((item, index) => {
                    return <HotelOrderListStatus
                        key={`hotelStatus${index}`}
                        status={item.type}
                        tabLabel={item.name}/>
                })}

            </ScrollableTabView>


        </View>)
    }
}
