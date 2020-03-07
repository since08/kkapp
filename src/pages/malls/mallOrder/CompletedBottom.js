import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList, ListView, TextInput} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import I18n from '../../../I18n/I18n';
import PayCountDown from '../../../components/PayCountDown';
import {cancelMallOrder, postWxPay, getWxPaidResult, postOrderConfirm, deleteMall} from "../../../services/MallDao";
import {MallStatus} from "../../../configs/Status";
import {util, payWx, isWXAppInstalled, call, alertOrder, showToast} from '../../../utils/ComonHelper';
import {DeShangPhone} from '../../../configs/Constants';
import {Button} from '../../../components'
import PayAction from "../../comm/PayAction";


export default class CompletedBottom extends Component {


    render() {
        const {orderItem} = this.props;
        return this.switchOrder(orderItem);
    }

    switchOrder = (orderItem) => {
        const {status} = orderItem;
        switch (status) {
            case MallStatus.unpaid:
                return this.renderPay(orderItem);
            case MallStatus.paid:
                return this.paidOrder(orderItem);
            case MallStatus.completed:
                return this.completedOrder(orderItem);
            case MallStatus.delivered:
                return this.deliveredOrder(orderItem);

            default:
                return <View/>;
        }
    };


    wxPay = (item) => {
        let data = {order_number: item.order_number, total: item.total_price};
        this.payAction && this.payAction.toggle(data)
    };


    _formatTime = (diff) => {

        let min = 0;
        if (min < 10) {
            min = '0' + min;
        }
        if (diff >= 60) {
            min = Math.floor(diff / 60);
            diff -= min * 60;
        }
        if (diff < 10) {
            diff = '0' + diff;
        }

        return `${min}:${diff}`
    };


    renderPay = (item) => {
        const {shipments, order_number} = item;
        return (//${I18n.t('pay')}
            <View style={styleO.bottomView}>
                <TouchableOpacity style={styleO.payView}
                                  onPress={() => {
                                      this.wxPay(item);
                                  }}>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 14, color: '#FFFFFF', zIndex: 999}}>{I18n.t('pay')}</Text>
                    </View>

                </TouchableOpacity>


                <View style={{height: 24, width: 1, backgroundColor: Colors._ECE}}/>

                <Text
                    onPress={() => {//`${I18n.t('confirm_cancel')}`
                        alertOrder("确认取消？", () => {
                            cancelMallOrder({order_number: order_number}, ret => {
                                if (this.props.refresh)
                                    this.props.refresh();
                            }, err => {
                            })
                        });
                    }}
                    style={[styleO.payment, {padding: 14}]}>{I18n.t('cancel_order')}</Text>

                <PayAction
                    type={'mall'}
                    ref={ref => this.payAction = ref}
                    refresh={this.props.refresh}/>
            </View>
        )
    };

    paidOrder = (orderItem) => {
        let isShowRefund = false;
        orderItem.order_items.forEach(x => {
            if (x.returnable) {
                isShowRefund = true
                return
            }

        })
        return <View style={styleO.bottomView}>
            <TouchableOpacity
                onPress={() => {
                    call(DeShangPhone)
                }}
                style={styleO.returnedBottom}>
                <Text style={styleO.orderSubmitTxt}>{I18n.t('contact_customer_service')}</Text>
            </TouchableOpacity>

            {isShowRefund ? <TouchableOpacity

                onPress={() => {
                    global.router.toMallSelectPage(orderItem, this.props.refresh)
                }}
                style={styleO.returnedBottom}>
                <Text style={styleO.orderSubmitTxt}>{I18n.t('refund_mall_amount')}</Text>
            </TouchableOpacity> : <View/>}

        </View>
    };


    cancelOrder = (orderItem) => {
        const {order_number} = orderItem;
        return (
            <View style={styleO.bottomView}>

                <TouchableOpacity
                    onPress={() => {
                        alertOrder("删除提示", () => {
                            deleteMall({order_number: order_number}, ret => {
                                if (this.props.pageOrderInfo) {
                                    global.router.pop();

                                } else if (this.props.refresh) {
                                    this.props.refresh();
                                }
                            }, err => {
                            })
                        })

                    }}
                    style={styleO.customer}>
                    <Text style={styleO.orderSubmitTxt}>{I18n.t('order_del')}</Text>
                </TouchableOpacity>

            </View>)
    };

    completedOrder = (orderItem) => {
        let i = 0;
        const {order_items} = orderItem;
        return (
            <View style={styleO.bottomView}>

                <TouchableOpacity
                    onPress={() => {
                        global.router.toLogisticsPage(orderItem)
                    }}
                    style={styleO.customer}>
                    <Text style={styleO.orderSubmitTxt}>{I18n.t('order_logistics')}</Text>
                </TouchableOpacity>
                {order_items.map((item, index) => {
                    if (item.returnable) {
                        i++;
                    }
                })}
                {i > 0 ? <TouchableOpacity
                    onPress={() => {
                        global.router.toMallSelectPage(orderItem, this.props.refresh)
                    }}
                    style={styleO.returnedBottom}>
                    <Text style={styleO.orderSubmitTxt}>退货／退款</Text>
                </TouchableOpacity> : null}

                {/*<TouchableOpacity*/}
                {/*onPress={() => {*/}
                {/*alertOrder("确认删除?", () => {*/}
                {/*deleteMall({order_number: order_number}, ret => {*/}
                {/*if (this.props.pageOrderInfo) {*/}
                {/*global.router.pop();*/}

                {/*} else if (this.props.refresh){*/}
                {/*this.props.refresh();*/}
                {/*}*/}
                {/*}, err => {*/}
                {/*})*/}
                {/*})*/}

                {/*}}*/}
                {/*style={styleO.customer}>*/}
                {/*<Text style={styleO.orderSubmitTxt}>{I18n.t('order_del')}</Text>*/}
                {/*</TouchableOpacity>*/}

            </View>)
    };


    deliveredOrder = (orderItem) => {
        const {shipments, order_number} = orderItem;
        return (
            <View style={styleO.bottomView}>
                <TouchableOpacity
                    onPress={() => {
                        alertOrder("确认收货？", () => {
                            postOrderConfirm({order_number: order_number}, data => {
                                if (this.props.refresh)
                                    this.props.refresh();
                            })
                        });
                    }}
                    style={styleO.returnedBottom2}>
                    <Text style={styleO.orderSubmitTxt1}>确认收货</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        global.router.toLogisticsPage(orderItem)
                    }}
                    style={styleO.customer}>
                    <Text style={styleO.orderSubmitTxt}>物流信息</Text>
                </TouchableOpacity>
                <TouchableOpacity

                    onPress={() => {
                        global.router.toMallSelectPage(orderItem)
                    }}
                    style={styleO.returnedBottom}>
                    <Text style={styleO.orderSubmitTxt}>退货／退款</Text>
                </TouchableOpacity>

            </View>
        )
    };
}


const styleO = StyleSheet.create({
    bottomView: {
        height: 50,
        backgroundColor: "#FFFFFF",
        marginTop: 0.5,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#EEEEEE'
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
    returnedBottom2: {
        borderWidth: 1,
        borderColor: '#F34A4A',
        borderRadius: 4,
        width: 90,
        height: 37,
        marginRight: 17,
        alignItems: 'center',
        justifyContent: 'center'
    },
    customer: {
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 4,
        width: 90,
        height: 37,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    returnedMall: {
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 4,
        width: 90,
        height: 37,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderSubmitTxt: {
        fontSize: 14,
        color: '#333333'
    },
    orderSubmitTxt1: {
        fontSize: 14,
        color: '#F34A4A'
    },
    payment: {
        fontSize: 14,
        color: '#333333',
        marginLeft: 17
    },
    paymentPrice: {
        fontSize: 18,
        color: '#F34A4A'
    },
    payView: {
        height: 37,
        width: 120,
        borderRadius: 4,
        backgroundColor: '#F34A4A',
        marginRight: 17, marginLeft: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    payCount: {
        height: 37,
        backgroundColor: '#F34A4A',
        alignItems: 'flex-start'
    }
})