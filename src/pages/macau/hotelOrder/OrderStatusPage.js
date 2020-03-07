import React, {Component} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import {NavigationBar} from '../../../components';
import ImageLoad from "../../../components/ImageLoad";
import {
    isEmptyObject, isWXAppInstalled, showToast, hotelOrderStatus, utcDate, call,
    alertOrder, util, strNotNull
} from "../../../utils/ComonHelper";
import {ImageMessage, Message} from '../HotelRoomListPage';
import {Prompt, ReservationTime} from '../RoomReservationPage';
import {RenderItem} from '../PaymentDetail';
import UnpaidBottom from "./UnpaidBottom";
import {HotelStatus} from "../../../configs/Status";
import {delHotelOrder, getHotelOrderInfo, postHotelWxPay, postHotelAliPay} from "../../../services/MacauDao";
import {DeShangPhone} from "../../../configs/Constants";
import PayModal from "../../buy/PayModal";
import I18n from '../../../I18n/I18n';
import {postAlipay, postMallOrder} from "../../../services/MallDao";
import PayAction from '../../comm/PayAction'

const intro = "该订单确认后不可被取消修改，若未入住将收取您全额房费。我们会根据您的付款方式进行授予权或扣除房费，如订单不确认将解除预授权或全额退款至您的付款账户。附加服务费用将与房费同时扣除货返还。"

export default class OrderStatusPage extends Component {
    state = {
        orderInfo: []
    };

    componentDidMount() {
        this._refresh()
    };

    _refresh = () => {
        getHotelOrderInfo({
            order_number: this.props.params.order_number
        }, data => {
            console.log("orderInfo:", data)
            this.setState({
                orderInfo: data
            })

        }, err => {

        })
    }

    _intro = () => {
        return (
            <View style={{marginTop: 19, marginLeft: 16, marginRight: 16, paddingBottom: 33}}>
                <Text style={{color: "#AAAAAA", fontSize: 12, lineHeight: 20}}><Text
                    style={{color: "#666666", fontSize: 12}}>扣款说明：</Text>{intro}</Text>
            </View>
        )
    }

    _person = (persons) => {
        return (
            <View style={{flexDirection: 'column', width: '100%', justifyContent: 'center', alignSelf: 'center'}}>
                {persons.map((item, i) => {
                    return (
                        <View key={i} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: i === 0 ? 0 : 14,
                            paddingBottom: i === persons.length - 1 ? 0 : 14,
                            borderBottomColor: i === persons.length - 1 ? 'white' : '#F3F3F3',
                            borderBottomWidth: i === persons.length - 1 ? 0 : 1
                        }}>
                            <TextInput style={[styles.room_num, {width: 100, paddingTop: 0, paddingBottom: 0}]}
                                       editable={false}
                                       value={item.last_name}
                                       underlineColorAndroid={'transparent'}/>
                            <Text style={[styles.txt]}>/</Text>
                            <TextInput
                                style={[styles.room_num, {marginLeft: 10, width: 100, paddingTop: 0, paddingBottom: 0}]}
                                editable={false}
                                value={item.first_name}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    )
                })}
            </View>
        )
    };
    _renderItem = ({item, index}, room_num) => {
        return (
            <RenderItem
                room_num={room_num}
                key={index}
                item={item}/>
        )
    };

    paidOrder = (status, order_number) => {
        if (status === HotelStatus.paid) {
            return (
                <TouchableOpacity
                    style={[styles.btn_book, {backgroundColor: Colors._E54}]}
                    onPress={() => {
                        call(DeShangPhone)
                    }}>
                    <Text style={[styles.btn_book_txt, {color: "#FFFFFF"}]}>联系客服</Text>
                </TouchableOpacity>
            )
        } else if (status === HotelStatus.canceled || status === HotelStatus.completed) {
            return (<TouchableOpacity
                style={[styles.btn_book, {backgroundColor: Colors._FFF}]}
                onPress={() => {
                    alertOrder("确认删除？", () => {
                        delHotelOrder({order_number: order_number}, ret => {
                            showToast("删除成功");
                            this.props.params.refresh && this.props.params.refresh();
                            router.pop();
                            global.router.toHotelOrderPage();
                        }, err => {
                        })

                    });
                }}>
                <Text style={[styles.btn_book_txt, {color: "#444444"}]}>删除订单</Text>
            </TouchableOpacity>)
        } else {
            return null;
        }

    };

    _submitBtn = () => {
        const {order_number, total_price, final_price} = this.state.orderInfo.order;
        let param = {order_number, total: final_price}

        this.payAction && this.payAction.toggle(param)

    };


    statusBottom = (order) => {
        const {status, pay_status, total_price, order_number, final_price} = order;
        switch (pay_status) {
            case HotelStatus.unpaid:
                return (
                    <View style={styles.bottomsView}>
                        <Text style={{color: "#333333", marginLeft: 14, fontSize: 14}}>合计：<Text
                            style={{color: "#E54A2E", fontSize: 18}}>¥{final_price}</Text></Text>
                        <View style={{flex: 1}}/>
                        <UnpaidBottom
                            refresh={this._refresh}
                            order_number={order_number}
                            total_price={final_price}
                            _submitBtn={this._submitBtn}/>
                    </View>
                );
            default:
                return <View/>;
        }
    };
    statusColor = (status, status_text) => {
        if (status_text === '退款申请中') {
            return "#333333"
        } else if (status === 'unpaid') {
            return "#E54A2E"
        } else if (status === 'paid') {
            return "#4A90E2"
        } else {
            return "#333333"
        }
    };
    _changedBar = (status_text, pay_status) => {
        if (pay_status === 'paid') {
            return '待入住';
        } else if (pay_status === 'unpaid') {
            return '待付款';
        } else if (pay_status === 'compeleted') {
            return '已完成';
        } else {
            return status_text
        }
    };

    _discount = (discount_amount, refund_price) => {
        if (discount_amount > 0) {
            return <View style={[styles.txtView, {borderTopWidth: 1, borderTopColor: "#F3F3F3"}]}>
                <Text style={styles.txt}>折扣</Text>
                <Text style={[styles.room_num, {marginLeft: 38}]}>{discount_amount}</Text>
            </View>
        } else if (refund_price > 0) {
            return <View style={[styles.txtView, {borderTopWidth: 1, borderTopColor: "#F3F3F3"}]}>
                <Text style={styles.txt}>折扣</Text>
                <Text style={[styles.room_num, {marginLeft: 38}]}>{refund_price}</Text>
            </View>
        }

    }


    render() {
        const {orderInfo} = this.state;
        if (isEmptyObject(orderInfo)) {
            return (
                <View style={ApplicationStyles.bgContainer}>
                    <NavigationBar
                        toolbarStyle={{backgroundColor: Colors._E54}}
                        title={''}
                        leftBtnIcon={Images.sign_return}
                        leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => router.pop()}/>
                </View>
            )
        }
        const {room, order, checkin_infos} = orderInfo;
        const {
            order_number, created_at, room_num, pay_status, status_text, status, telephone, total_price, room_items, checkin_date,
            discount_amount, refund_price, checkout_date, nights_num, final_price
        } = order;
        let date = {begin_date: checkin_date, end_date: checkout_date, counts: nights_num};

        return (
            <View style={ApplicationStyles.bgContainer}>

                <NavigationBar
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={status_text}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        router.pop();
                        router.pop()
                        global.router.toHotelOrderPage()
                    }}/>
                <ScrollView style={{flexDirection: 'column', paddingBottom: 90}}>

                    <View style={styles.barView}>
                        <View style={styles.bar}>
                            <ImageMessage images={room.images}/>
                            <Message item={room}/>
                        </View>
                    </View>

                    <Prompt/>
                    <ReservationTime
                        date={date}/>
                    <View style={styles.orderInfo}>
                        <Text style={styles.infoTxt}>订单信息</Text>
                        <Text style={[styles.infoTxt2, {marginTop: 25}]}>订单编号：{order_number}</Text>
                        <Text
                            style={[styles.infoTxt2, {marginTop: 6}]}>下单时间：{utcDate(created_at, 'YYYY/MM/DD  HH:MM')}</Text>
                        <Text style={[styles.infoTxt2, {marginTop: 6}]}>订单状态：
                            <Text
                                style={{color: this.statusColor(pay_status, status_text)}}>{status_text}</Text>
                        </Text>
                    </View>

                    <View style={styles.reservationInfo}>
                        <Text style={[styles.infoTxt, {marginBottom: 10}]}>预订信息</Text>
                        <View style={{width: '100%', height: 1, backgroundColor: '#F3F3F3'}}/>
                        <View style={styles.txtView}>
                            <Text style={styles.txt}>房间数</Text>
                            <Text style={styles.room_num}>{room_num}</Text>
                        </View>
                        <View style={styles.personView}>
                            <Text style={[styles.txt]}>入住人</Text>
                            {this._person(checkin_infos)}
                        </View>

                        <View style={styles.txtView}>
                            <Text style={styles.txt}>手机号</Text>
                            <Text style={styles.room_num}>{telephone}</Text>
                        </View>
                        {this._discount(discount_amount, refund_price)}

                    </View>

                    <View style={{
                        marginTop: 17,
                        paddingTop: 10,
                        paddingBottom: 23,
                        backgroundColor: 'white',
                        flexDirection: 'column'
                    }}>
                        <Text style={[styles.infoTxt, {marginBottom: 10}]}>订单明细</Text>
                        <View style={{width: '100%', height: 1, backgroundColor: '#F3F3F3'}}/>

                        <FlatList
                            style={{marginLeft: 30, marginRight: 22, marginTop: 26}}
                            showsHorizontalScrollIndicator={false}
                            data={room_items}
                            renderItem={(item) => this._renderItem(item, room_num)}
                            keyExtractor={(item, index) => index + "item"}
                        />
                        <View style={{
                            marginLeft: 30,
                            marginRight: 22,
                            marginTop: 17,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.infoTxt3}>应付金额</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{color: "#E54A2E", fontSize: 14}}>¥{final_price}</Text>
                        </View>
                    </View>
                    {this._intro()}

                    {this.paidOrder(status, order_number)}
                </ScrollView>
                {status === 'unpaid' ? this.statusBottom(order) : null}
                <PayAction
                    ref={ref => this.payAction = ref}
                    type={'hotel'}
                    refresh={this._refresh}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    btn_book: {
        marginLeft: 14,
        marginRight: 14,
        marginBottom: 100,
        width: '90%',
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#DDDDDD'
    },
    btn_book_txt: {
        fontSize: 18
    },
    bottomsView: {
        paddingTop: 9,
        paddingBottom: 9,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0,
        zIndex: 9999,

    },
    personView: {
        flexDirection: 'row',
        paddingTop: 14,
        marginLeft: 14,
        marginRight: 13,
        paddingBottom: 14,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F3F3'

    },
    room_num: {
        color: '#444444',
        fontSize: 15,
        marginLeft: 30
    },
    txtView: {
        marginLeft: 14,
        paddingBottom: 14,
        flexDirection: 'row',
        paddingTop: 14,
        alignItems: 'center'
    },
    txt: {
        color: '#AAAAAA',
        fontSize: 14
    },
    reservationInfo: {
        marginTop: 5,
        paddingTop: 10,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    infoTxt2: {
        color: "#333333",
        fontSize: 14,
        marginLeft: 17,
        lineHeight: 20
    },
    infoTxt: {
        color: "#333333",
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
        marginLeft: 17
    },
    infoTxt3: {
        color: "#333333",
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold'
    },
    orderInfo: {
        marginTop: 5,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingBottom: 22
    },
    barView: {
        width: '100%',
        backgroundColor: Colors._E54,
        marginTop: 0,
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: "center",
        alignItems: 'center'
    },
    bar: {
        marginLeft: 17,
        marginRight: 17,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 3
    },
})