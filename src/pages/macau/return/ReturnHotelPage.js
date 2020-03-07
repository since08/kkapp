//退换货申请页面
import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert, ListView, TextInput} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import {NavigationBar, BaseComponent} from '../../../components';
import ImageLoad from "../../../components/ImageLoad";
import {alertOrder, showToast} from "../../../utils/ComonHelper";
import {returnHotelOrder} from "../../../services/MacauDao";


export default class ReturnHotelPage extends Component {

    state = {
        memo: ""
    }

    _notes = (item) => {
        const {room_title, order} = item;
        const {nights_num, room_num} = order;
        return <View style={styles.notes}>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{nights_num}晚</Text>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{room_num}间</Text>
            <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 12}}>{room_title}</Text>
        </View>
    };

    render() {
        const {item} = this.props.params;
        const {hotel_logo, hotel_title, order} = item;
        const {checkin_date, checkout_date, status, total_price, order_number,final_price} = order;
        let time = `${checkin_date}至${checkout_date}`;

        return (
            <BaseComponent
                style={ApplicationStyles.bgContainer}
                ref={ref => this.contain = ref}>
                <NavigationBar
                    titleStyle={{fontSize: 17, color: '#161718'}}
                    toolbarStyle={{backgroundColor: Colors._FFF}}
                    title={'申请退款'}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        router.pop()
                    }}
                />


                <View style={styles.itemView}>
                    <View style={{height: 1, backgroundColor: "#ECECEE", width: '100%'}}/>
                    <View style={styles.item}>
                        <ImageLoad
                            style={{width: 100, height: 96}}
                            source={{uri: hotel_logo}}/>
                        <View style={styles.message}>
                            <Text style={{color: "#333333", fontSize: 16}}>{hotel_title}</Text>
                            <Text style={{color: "#666666", fontSize: 12, marginTop: 7}}>{time}</Text>
                            {this._notes(item)}
                        </View>
                    </View>

                </View>

                <View style={styles.returnPriceView}>
                    <Text style={{color: '#333333', fontSize: 14, marginLeft: 17}}>退款金额：</Text>
                    <Text style={{color: '#F24A4A', fontSize: 18}}>¥{final_price}</Text>
                </View>
                <View style={styles.returnPriceView}>
                    <Text style={{color: '#333333', fontSize: 14, marginLeft: 17}}>退款说明：</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={text => {
                            this.setState({
                                memo: text
                            })
                        }}
                        underlineColorAndroid='transparent'
                        numberOfLines={1}
                    />
                </View>

                <TouchableOpacity style={{
                    position: 'absolute',
                    width: '100%',
                    paddingTop: 13,
                    paddingBottom: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "#E54A2E",
                    bottom: 0
                }}
                                  onPress={() => {
                                      alertOrder("确认提交？", () => {
                                          returnHotelOrder({memo: this.state.memo, order_number: order_number}, ret => {
                                              showToast('申请提交成功');
                                              this.props.params.refresh && this.props.params.refresh();
                                              this.contain && this.contain.close();
                                              global.router.pop();

                                          }, err => {
                                              showToast(err);
                                          })
                                      });
                                  }}
                >
                    <Text style={{color: '#FFFFFF', fontSize: 18}}>提交</Text>
                </TouchableOpacity>
            </BaseComponent>
        )
    }
}
const styles = StyleSheet.create({
    inputText: {
        fontSize: 14,
        flex: 1,
        marginTop: 5
    },
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
        flexDirection: 'row',
        alignItems: 'center'
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
    },
    returnPriceView: {
        marginTop: 11,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
    }
})