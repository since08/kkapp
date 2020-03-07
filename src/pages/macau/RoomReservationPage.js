import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import ImageLoad from "../../components/ImageLoad";
import {
    isEmptyObject, showToast, convertDate, strNotNull, alertOrderChat, payWx, util,
    isWXAppInstalled, mul, sub, logMsg, getMax
} from "../../utils/ComonHelper";
import {ImageMessage, Message} from './HotelRoomListPage';
import ReservationBottom from "./ReservationBottom";
import PaymentDetail from './PaymentDetail';
import {postRoomReservation, postHotelOrder, getUsingCoupons} from "../../services/MacauDao";
import {addTimeRecode} from "../../components/PayCountDown";
import Loading from "../../components/Loading";

const info = "该订单确认后不可被取消修改，若未入住将收取您全额房费。我们会根据您的付款方式进行授予权或扣除房费，如订单不确认将解除预授权或全额退款至您的付款账户。附加服务费用将与房费同时扣除货返还。"
const prompt = "订单一经确认，不可更改或添入住人姓名。 未满18岁的小孩需有成人陪同才可入住。"

export default class RoomReservationPage extends PureComponent {
    state = {
        room_num: 1,
        tempStock: this.props.params.price_item.saleable_num > 10 ? 10 : this.props.params.price_item.saleable_num,
        detailsShow: false,
        roomReservation: [],
        selected_coupon: {},
        persons: [{last_name: '', first_name: ''}],
        phone: '',
        isInstall: false,
        order_number: ''
    };

    componentDidMount() {
        console.log("11", this)
        isWXAppInstalled(isInstall => {
            this.setState({
                isInstall: isInstall
            })
        });

        this.refresh(true)
    };

    coupon_select = (reservation) => {
        getUsingCoupons({amount: reservation.order.total_price}, data => {

            if (!isEmptyObject(data) && data.items.length > 0) {
                let selected_coupon = getMax(data.items, reservation.order.total_price);

                console.log("最优惠的优惠券", selected_coupon);

                this._selectedCoupon(selected_coupon);

                this.setState({
                    selected_coupon
                })
            }

        }, err => {

        })
    };

    refreshParam = () => {
        const {item, date, price_item} = this.props.params;
        let body = {
            coupon_id: this.state.selected_coupon.coupon_number,
            checkin_date: date.begin_date,
            checkout_date: date.end_date,
            hotel_room_id: item.id,
            room_price_id: price_item.room_price_id,
            room_num: this.state.room_num
        }
        return body;
    };

    refresh = (isFirst) => {
        this.container && this.container.open();
        let body = this.refreshParam()
        postRoomReservation(body, data => {
            console.log("roomReservation:", data);
            this.coupon_select(data);
            this.setState({
                roomReservation: data
            })


            if (!isFirst && !strNotNull(this.state.phone)) {
                showToast('手机号码不能为空');
                return
            }

            if (!isFirst)
                this.submitBtn(data)


        }, err => {
            logMsg('错误信息', err)
            showToast("该房间已经售罄啦，请重新选择");
            setTimeout(() => {
                this.props.params.refresh && this.props.params.refresh();
                router.pop();
            }, 1000)
        })

    };


    postParam = () => {
        const {detailsShow, roomReservation, room_num, persons, phone, selected_coupon} = this.state;
        const {date, price_item} = this.props.params;
        const {order, room} = roomReservation;
        let body = {
            coupon_id: selected_coupon.coupon_number,
            checkin_date: date.begin_date,
            checkout_date: date.end_date,
            hotel_room_id: room.id,
            room_num: order.room_num,
            room_price_id: price_item.room_price_id,
            telephone: phone,
            checkin_infos: persons
        }
        return body;
    };

    submitBtn = () => {
        const {order_number} = this.state;
        if (!util.isEmpty(order_number))
            return;
        if (true) {
            let body = this.postParam();
            postHotelOrder(body, data => {
                console.log("hotel_order_number", data)
                this.setState({
                    order_number: data.order_number
                });
                addTimeRecode(data.order_number);
                global.router.toOrderStatusPage(data.order_number)
            }, err => {
                logMsg('错误信息', err)
                // showToast("该房间已经售罄啦，请重新选择");
            });

        }


    };

    _detailsShow = (temp) => {
        this.setState({
            detailsShow: !this.state.detailsShow
        })
    };

    onclick_changed = (room_num, persons) => {
        console.log("改变入住人的页面信息重新获取")
        this.setState({
            room_num: room_num,
            persons: persons
        })
        const {roomReservation, phone, selected_coupon} = this.state;
        const {date, price_item} = this.props.params;
        const {order, room} = roomReservation;
        let body = {
            coupon_id: selected_coupon.coupon_number,
            checkin_date: date.begin_date,
            checkout_date: date.end_date,
            hotel_room_id: room.id,
            room_price_id: price_item.room_price_id,
            room_num: room_num,
            telephone: phone,
            checkin_infos: persons
        }
        postRoomReservation(body, data => {
            console.log("改变入住人的页面信息重新获取roomReservation:", data)
            this.setState({
                roomReservation: data
            })
        }, err => {
            console.log("房间2", err)
        })
    }

    roomQuantity = (room_num, persons) => {

        const styleCutDisable = {
            backgroundColor: '#FBFAFA'
        };
        const styleCut = {
            backgroundColor: '#F6F5F5'
        };
        let {tempStock} = this.state;

        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={[styles.buyTouch, room_num === 1 ? styleCutDisable : styleCut]}
                    onPress={() => {
                        if (room_num > 1) {
                            if (persons.length > 1) {
                                persons = persons.slice(0, persons.length - 1);
                            }
                            // this.setState({
                            //     room_num: --room_num,
                            //     persons: persons
                            // })
                            this.onclick_changed(--room_num, persons)
                        }

                    }}>
                    <Image style={styles.buyImgCut} source={Images.cut}/>
                </TouchableOpacity>

                <View style={styles.buyInput}>
                    <Text>{room_num}</Text>
                </View>

                <TouchableOpacity
                    style={styles.buyTouch}
                    onPress={() => {
                        if (room_num < tempStock) {
                            if (persons.length <= tempStock) {
                                persons.push({last_name: '', first_name: ''});
                            }
                            // this.setState({
                            //     room_num: ++room_num,
                            //     persons: persons
                            // })
                            this.onclick_changed(++room_num, persons)
                        } else {
                            // showToast("房间数量不足")
                        }

                    }}>
                    <Image style={styles.buyImgAdd} source={Images.add}/>
                </TouchableOpacity>
            </View>
        )
    };
    line = () => {
        return (
            <View style={{width: '90%', backgroundColor: '#F3F3F3', height: 1.5}}/>
        )
    };
    _phone = (phone) => {
        this.setState({
            phone: phone
        })
    };

    _selectedCoupon = (selected_coupon) => {
        console.log("改变入住人的页面信息重新获取：", selected_coupon)
        this.setState({
            selected_coupon: selected_coupon
        })
        const {roomReservation, phone, persons} = this.state;
        const {date, price_item} = this.props.params;
        const {order, room} = roomReservation;
        let body = {
            coupon_id: selected_coupon.coupon_number,
            checkin_date: date.begin_date,
            checkout_date: date.end_date,
            hotel_room_id: room.id,
            room_price_id: price_item.room_price_id,
            room_num: order.room_num,
            telephone: phone,
            checkin_infos: persons
        }
        postRoomReservation(body, data => {
            console.log("改变入住人的页面信息重新获取roomReservation:", data)
            this.setState({
                roomReservation: data
            })
        }, err => {
            console.log("房间3", err)
        })

    };

    coupon_name = () => {
        const {selected_coupon} = this.state;
        if (!strNotNull(selected_coupon.name)) {
            return '暂无可用优惠券';
        } else {
            return selected_coupon.name;
        }
    }

    render() {
        const {detailsShow, roomReservation, persons, phone, selected_coupon, max_coupons} = this.state;
        if (isEmptyObject(roomReservation)) {
            return (
                <View style={ApplicationStyles.bgContainer}>
                    <NavigationBar
                        toolbarStyle={{backgroundColor: Colors._E54}}
                        title="房间预订"
                        leftBtnIcon={Images.sign_return}
                        leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => {
                            this.props.params.refresh && this.props.params.refresh();
                            router.pop();
                        }}/>
                </View>
            )
        }
        const {order, room} = roomReservation;
        const {images, notes, tags, title} = room;
        return (
            <View style={ApplicationStyles.bgContainer}>

                <NavigationBar
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title="房间预订"
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        this.props.params.refresh && this.props.params.refresh();
                        router.pop();
                    }}/>
                <ScrollView style={{flexDirection: 'column', paddingBottom: 90}}>

                    <View style={styles.barView}>
                        <View style={styles.bar}>
                            <ImageMessage images={images}/>
                            <Message item={room}/>
                        </View>
                    </View>

                    <Prompt/>
                    <ReservationTime
                        date={this.props.params.date}/>
                    <RoomMessage
                        room_num={order.room_num}
                        roomQuantity={this.roomQuantity}
                        price={order.final_price}
                        persons={persons}
                        _phone={this._phone}/>

                    <TouchableOpacity style={styles.offerView}
                                      onPress={() => {
                                          global.router.toCouponSelectPage(order.total_price, this._selectedCoupon, this.state.selected_coupon)
                                      }}>
                        <View style={{
                            width: 14, height: 14, alignItems: 'center',
                            justifyContent: 'center', backgroundColor: '#E54A2E', marginLeft: 14
                        }}>
                            <Text style={{color: "#FFFFFF", fontSize: 12}}>减</Text>
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 6, justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: "#444444", fontSize: 14}}>已减</Text>
                                <Text style={{
                                    color: "#E54A2E",
                                    fontSize: 14,
                                    marginLeft: 12
                                }}>¥{order.discount_amount}</Text>
                            </View>
                            <Text style={{
                                marginTop: 8,
                                color: '#AAAAAA',
                                fontSize: 12
                            }}>{this.coupon_name()}</Text>
                        </View>
                        <View style={{flex: 1}}/>
                        <Image style={{width: 10, height: 20, marginRight: 14, alignSelf: 'center'}}
                               source={Images.macau.right}/>
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: 'column',
                        marginTop: 23,
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom: 50
                    }}>
                        <Text style={styles.info}><Text style={styles.prompt}>扣款说明：</Text>{info}</Text>

                        <Text style={[styles.info, {marginTop: 5}]}><Text style={styles.prompt}>特别提示：</Text>{prompt}
                        </Text>
                    </View>
                </ScrollView>
                {detailsShow ? <PaymentDetail
                    _detailsShow={this._detailsShow}
                    order={order}
                    room_num={order.room_num}
                /> : null}
                <ReservationBottom
                    saleable_num={this.props.params.price_item.saleable_num}
                    _detailsShow={this._detailsShow}
                    refresh={this.refresh}
                    order={order}
                    date={this.props.params.date}
                    persons={persons}
                    phone={phone}
                    submitBtn={this.submitBtn}/>
            </View>
        )
    }
}

export class RoomMessage extends PureComponent {
    _person = (persons) => {

        return (
            <View style={{
                flexDirection: 'column',
                alignSelf: 'center',
                justifyContent: 'flex-start',
                marginLeft: 24,
                paddingTop: 0
            }}>
                {persons.map((item, i) => {
                    return (
                        <View key={i} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: i === persons.length - 1 ? 0 : 14,
                            marginRight: 13,
                            marginTop: i === 0 ? 0 : 14,
                            borderBottomColor: '#F3F3F3',
                            borderBottomWidth: i === persons.length - 1 ? 0 : 1

                        }}>
                            <TextInput maxLength={18}
                                       style={[styles.room_num, {width: 100, paddingTop: 0, paddingBottom: 0}]}
                                       clearTextOnFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       placeholder={'姓（例：LI）'}
                                       placeholderTextColor={Colors._CCC}
                                       onChangeText={txt => {
                                           item.last_name = txt;
                                       }}
                                       autoCapitalize={'characters'}/>
                            <Text style={[styles.txt7, {
                                marginLeft: 11,
                                marginRight: 11,
                                color: '#CCCCCC',
                                paddingTop: 0
                            }]}>/</Text>
                            <TextInput maxLength={18}
                                       style={[styles.room_num, {width: 150, paddingTop: 0, paddingBottom: 0}]}
                                       clearTextOnFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       placeholder={'名（例：XIAOMING）'}
                                       placeholderTextColor={Colors._CCC}
                                       onChangeText={txt => {
                                           item.first_name = txt;
                                       }}
                                       autoCapitalize={'characters'}/>
                        </View>
                    )
                })}
            </View>
        )

    };

    render() {
        const {persons, phone, room_num} = this.props;
        return (
            <View style={styles.personMessage}>
                <View style={styles.roomView}>
                    <Text style={styles.rooms}>房间数</Text>
                    <View style={{flex: 1}}/>
                    {this.props.roomQuantity(room_num, persons)}
                </View>

                <View style={styles.Roomcounts}>
                    <Text style={styles.rooms}>入住人</Text>

                    {this._person(persons)}
                </View>
                <View style={styles.phoneView}>
                    <Text style={[styles.txt2, {marginLeft: 14}]}>手机号</Text>
                    <TextInput
                        ref="inputWR"
                        keyboardType={'numeric'}
                        style={{flex: 1, marginLeft: 25, paddingTop: 0, paddingBottom: 0}}
                        maxLength={12}
                        numberOfLines={1}
                        underlineColorAndroid={'transparent'}
                        onChangeText={txt => {
                            this.props._phone(txt)
                        }}
                        value={phone}/>
                </View>

            </View>
        )
    }

}


export class Prompt extends PureComponent {
    render() {
        return (
            <View style={styles.confirm}>
                <Image style={{marginLeft: 17, width: 20, height: 20}} source={Images.macau.night}/>
                <Text style={{color: "#4A90E2", fontSize: 14, marginLeft: 10}}>订单确认后将为您保留整晚 </Text>
            </View>
        )
    }
}

export class ReservationTime extends PureComponent {
    render() {
        const {begin_date, end_date, counts} = this.props.date;
        return (
            <View style={styles.timeView}>
                <Text style={{
                    marginLeft: 14,
                    color: '#444444',
                    fontSize: 14
                }}>入住时间：{convertDate(begin_date, 'M月DD日')} </Text>
                <Text style={{
                    marginLeft: 10,
                    color: '#444444',
                    fontSize: 14
                }}>离店时间：{convertDate(end_date, 'M月DD日')} </Text>
                <Text style={{marginLeft: 6, color: '#AAAAAA', fontSize: 14}}>共{counts}天</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    room_num: {
        color: '#444444',
        fontSize: 15
    },
    txt7: {
        color: '#AAAAAA',
        fontSize: 14
    },
    personView: {
        flexDirection: 'row',
        paddingTop: 14,
        marginLeft: 14,
        marginRight: 13,
        paddingBottom: 14,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F3F3'

    },
    info: {
        color: "#AAAAAA",
        fontSize: 12,
        lineHeight: 18
    },
    prompt: {
        color: "#666666",
        fontSize: 12,
        marginTop: 5,
        lineHeight: 18
    },
    offerView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 6,
        paddingTop: 7,
        paddingBottom: 11
    },
    phoneView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 14,
        paddingBottom: 14,
        flex: 1
    },
    txt2: {
        color: "#AAAAAA",
        fontSize: 15
    },
    txt: {
        color: "#444444",
        fontSize: 15
    },
    nameView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 24
    },
    buyImgCut: {
        width: 12,
        height: 2
    },
    buyImgAdd: {
        width: 12,
        height: 12,
    },
    buyTouch: {
        width: 33,
        height: 30,
        backgroundColor: '#F6F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyInput: {
        width: 38,
        height: 30,
        borderRadius: 1,
        marginLeft: 2,
        marginRight: 2,
        backgroundColor: '#F6F5F5',
        alignItems: 'center',
        justifyContent: 'center'
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
    counts: {
        width: 22,
        height: 11,
        backgroundColor: "#000000",
        borderRadius: 2,
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
        marginBottom: 1
    },
    confirm: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: 13,
        paddingBottom: 11,
        alignItems: 'center'
    },
    timeView: {
        marginTop: 4,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    personMessage: {
        flexDirection: 'column',
        marginTop: 10,
        backgroundColor: 'white'
    },
    roomView: {
        flexDirection: 'row',
        paddingTop: 7,
        paddingBottom: 7,
        alignItems: 'center',
        marginLeft: 14,
        marginRight: 14,
        borderBottomWidth: 1,
        borderColor: "#F3F3F3"
    },
    Roomcounts: {
        marginLeft: 14,
        marginRight: 14,
        paddingTop: 14,
        flexDirection: 'row',

        paddingBottom: 14,
        borderBottomWidth: 1,
        borderColor: "#F3F3F3"

    },
    rooms: {color: "#AAAAAA", fontSize: 14}
})