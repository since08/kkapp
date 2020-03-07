import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import {NavigationBar} from '../../../components';
import ImageLoad from "../../../components/ImageLoad";
import {isEmptyObject, showToast} from "../../../utils/ComonHelper";
import UnpaidBottom from './UnpaidBottom';
import {HotelStatus} from "../../../configs/Status";
import {} from '../../../services/MacauDao';

export default class HotelItem extends PureComponent {

    _line = () => {
        return (
            <View style={{height: 1, width: '100%', backgroundColor: "#F3F3F3"}}/>
        )
    };

    _notes = (item) => {
        const {room_title, order} = item;
        const {nights_num, room_num} = order;
        return <View style={styles.notes}>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{nights_num}晚</Text>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{room_num}间</Text>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{room_title}</Text>
        </View>
    };

    bottomShow=(item)=>{
        const {order} = item;
        if(order.status === HotelStatus.paid && order.refundable){
            return(
                <TouchableOpacity

                    onPress={() => {
                        global.router.toReturnHotelPage(item,this.props.refresh)
                    }}
                    style={styles.returnedBottom}>
                    <Text style={styles.orderSubmitTxt}>退款</Text>
                </TouchableOpacity>
            )
        }else{
            return <View/>
        }

    }

    render() {
        const {hotel_logo, hotel_title, order} = this.props.item;

        const {checkin_date, checkout_date, status, total_price,order_number,final_price} = order;
        let time = `${checkin_date}至${checkout_date}`;
        return (
            <View style={styles.itemView}>
                {this._line()}
                <View style={styles.item}>
                    <ImageLoad
                        style={{width: 100, height: 96}}
                        source={{uri: hotel_logo}}/>
                    <View style={styles.message}>
                        <Text style={{color: "#333333", fontSize: 16}}>{hotel_title}</Text>
                        <Text style={{color: "#666666", fontSize: 12, marginTop: 7}}>{time}</Text>
                        {this._notes(this.props.item)}
                    </View>
                </View>
                {this._line()}

                <View style={styles.page}>
                    <Text style={{color: "#333333", marginLeft: 14, fontSize: 14}}>合计：<Text
                        style={{color: "#E54A2E", fontSize: 18}}>¥{final_price}</Text></Text>
                    <View style={{flex: 1}}/>

                    {status === HotelStatus.unpaid ? <UnpaidBottom
                        order_number={order_number}
                        total_price={final_price}
                        refresh={this.props.refresh}/> : this.bottomShow(this.props.item)}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    returnedBottom: {
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 4,
        width: 90,
        height: 37,
        marginRight: 17,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderSubmitTxt: {
        fontSize: 14,
        color: '#333333'
    },
    page: {
        flex: 1,
        height: 50,
        flexDirection:'row',
        alignItems:'center'
    },
    notes: {
        flexDirection: 'row',
        marginTop: 10
    },
    message: {
        flexDirection: 'column',
        marginLeft: 14,
        marginTop: 2
    },
    item: {
        flexDirection: 'row',
        marginLeft: 17,
        marginRight: 17,
        marginTop: 12,
        marginBottom: 12
    },
    itemView: {
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    statusView: {
        marginLeft: 17,
        marginRight: 17,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    }
})