/**
 * Created by lorne on 2017/8/4.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, Modal,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import I18n from "../../I18n/I18n";
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {
    isEmptyObject, strNotNull, payWx, alipay, showToast, alertOrderChat,
    isWXAppInstalled, logMsg
} from '../../utils/ComonHelper';
import propType from 'prop-types';
import * as helper from '../../services/RequestHelper';
import Api from '../../configs/ApiConfig';
import {cancelHotelOrder} from "../../services/MacauDao";


export default class PayAction extends Component {

    state = {
        visible: false,
        selectTab: 0,
        order: {},
        total: 0
    }


    toggle = (order) => {
        this.setState({
            visible: !this.state.visible,
            order
        })
    }

    close = () => {
        this.setState({
            visible: false
        })
    }


    intro = () => {
        return (
            <View style={{width: '100%', height: 30, backgroundColor: '#C1D4E1', justifyContent: 'center'}}>
                <Text style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    marginLeft: 17,
                    marginRight: 17
                }}>大额消费请查看支付帮助，选择单笔限额高的银行卡支付</Text>
            </View>
        )
    }


    render() {
        return (<Modal
            onRequestClose={() => {

            }}
            animationType={"none"}
            transparent={true}
            visible={this.state.visible}
            style={styles.page}>
            <View style={styles.pageTop}/>

            <View style={styles.page2}>
                {this.topView()}
                <View style={{height: 1}}/>
                <ScrollView>
                    {/*{this.intro()}*/}
                    {this.orderView()}
                    {/* {this.aliView()} */}
                    {this.wxView()}
                    <View style={{height: 80}}/>
                </ScrollView>

                {this.payView()}
            </View>

        </Modal>)
    }

    topView = () => {

        return <View style={styles.top}>
            <Text style={styles.title}>在线支付</Text>
            <TouchableOpacity
                onPress={this.close}
                style={styles.btnClose}>
                <Image
                    source={Images.pay_close}
                    style={styles.imgClose}/>

            </TouchableOpacity>

        </View>;
    };

    orderView = () => {

        if (!isEmptyObject(this.state.order)) {
            const {order_number, total} = this.state.order;
            return <View style={styles.page3}>

                <Image style={styles.img3}
                       source={Images.pay_ticket}/>

                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.txt3}>需付款</Text>
                        <Text style={[styles.txt32, {marginLeft: 15}]}>{`¥${total}`}</Text>
                    </View>
                    <Text style={styles.txt31}>{`订单编号: ${order_number}`}</Text>
                </View>

            </View>;
        }

    };


    aliView = () => {
        return <TouchableOpacity
            onPress={() => {
                this.setState({selectTab: 0})
            }}
            style={styles.page4}>

            <Image style={styles.img7}
                   source={Images.pay_card}/>

            <View>
                <Text style={styles.txt3}>支付宝支付</Text>
                <Text style={styles.txt31}>信用卡储蓄卡付款，快捷支付</Text>
            </View>
            <View style={{flex: 1}}/>
            <View
                style={styles.rightImgs}>
                <Image
                    source={this.state.selectTab === 0 ? Images.pay_selected : Images.pay_select}
                    style={styles.img5}/>

            </View>


        </TouchableOpacity>;
    };

    wxView = () => {
        return <TouchableOpacity
            onPress={() => {
                this.setState({selectTab: 1})
            }}
            style={styles.page5}>

            <Image style={styles.img4}
                   source={require('../../../source/buy/weixin.png')}/>

            <View>
                <Text style={styles.txt3}>{I18n.t('pay_weixin')}  </Text>
                <Text style={styles.txt31}>{I18n.t('pay_weixin_support')}</Text>
            </View>
            <View style={{flex: 1}}/>
            <View
                style={styles.rightImgs}>
                <Image
                    source={this.state.selectTab === 1 ? Images.pay_selected : Images.pay_select}
                    style={styles.img5}/>

            </View>

        </TouchableOpacity>;
    };

    componentWillUnmount() {
        this.close()
    }


    payView = () => {

        const {type} = this.props;
        return <TouchableOpacity
            onPress={() => {
                if (!strNotNull(this.state.order.order_number)) {
                    showToast('支付失败')
                    this.close()
                    return;
                }
                if (this.state.selectTab === 0) {
                    this.ali_pay()
                    this.toggle(this.state.order)
                }

                if (this.state.selectTab === 1) {
                    this.wxpay()
                    this.toggle(this.state.order)
                }
            }}
            style={styles.btnPay}>
            <Text style={styles.txtPay}>确认支付</Text>
        </TouchableOpacity>
    }

    wxpay = () => {
        let url = '';
        const {type} = this.props;
        const {order} = this.state;
        console.log("djskjdskds", order)

        let pay_result = '';

        if (type === 'hotel') {
            url = Api.hotel_wxPay(order)
            pay_result = Api.hotel_wx_paid_result(order)
        }
        if (type === 'mall') {
            url = Api.mall_wxPay(order)
            pay_result = Api.wx_paid_result(order)
        }

        helper.post(url, {}, ret => {
            isWXAppInstalled(install => {

                if (install) {
                    payWx(ret.data, ret => {
                        console.log('支付成功', ret)

                        helper.get(pay_result, data => {
                            this.pay_handle()
                        }, err => {
                            this.pay_handle()
                        })

                    }, err => {
                        console.log('支付失败', err)
                        // 酒店预定和商品购买状态页面
                        this.pay_handle()
                    })
                } else {
                    showToast('你没有安装微信，不能使用微信支付')
                }
            })
        }, err => {
            logMsg('错误信息', err);
            if (type === 'hotel') {
                showToast("该房间已经售罄啦，请重新选择");
                setTimeout(() => {
                    this.props.refresh && this.props.refresh();
                }, 1000)
            }
        })
    }


    pay_handle = () => {
        const {type} = this.props;
        console.log('支付结果处理')
        this.close();
        if (this.props.refresh) {
            this.props.refresh();
        } else {
            if (type === 'hotel') {
                router.replace({
                    name: 'OrderStatusPage',
                    params: {order_number: this.state.order.order_number}
                })
            } else if (type === 'mall') {
                global.router.replaceMallOrderInfo(this.state.order)
            }
        }
    }

    ali_pay = () => {
        let url = '';
        const {type} = this.props;
        const {order} = this.state;

        if (type === 'hotel') {
            url = Api.hotel_aliPay(order.order_number)
        }

        if (type === 'mall') {
            url = Api.alipay(order.order_number)
        }

        helper.post(url, {}, ret => {

            alipay(ret.data.payment_params, ret => {
                console.log('支付成功', ret)
                this.pay_handle()
            }, err => {
                console.log('支付失败', err)
                this.pay_handle()

            })

        }, err => {
            showToast(err)
            this.props.refresh();
            if (type === 'hotel') {
                router.replace({
                    name: 'OrderStatusPage',
                    params: {order_number: this.state.order.order_number}
                })
            } else if (type === 'mall') {
                global.router.replaceMallOrderInfo(this.state.order)
            }

        })

    }
}

const styles = StyleSheet.create({
    rightImgs: {
        height: 56,
        width: 56,
        justifyContent: 'center',
        alignItems: 'center'
    },
    page: {
        flex: 1
    },
    pageTop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},
    page2: {
        flex: 1,
        backgroundColor: Colors.bg_ec
    },
    top: {
        height: 56,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 17,
        color: '#444444',
    },
    btnClose: {
        position: 'absolute',
        left: 0,
        height: 56,
        width: 56,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgClose: {
        height: 19,
        width: 19,
    },
    page3: {
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    img3: {
        height: 37,
        width: 37,
        marginLeft: 17,
        marginRight: 22
    },
    txt3: {
        fontSize: 15,
        color: '#444444',
    },
    txt31: {
        fontSize: 12,
        color: Colors._888,
        marginTop: 8
    },
    txt32: {
        fontSize: 18,
        color: Colors._DF1
    },
    page4: {
        height: 74,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginTop: 14
    },
    page5: {
        height: 74,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginTop: 1
    },
    img4: {
        height: 23,
        width: 29,
        marginLeft: 17,
        marginRight: 22
    },
    img7: {
        height: 26,
        width: 26,
        marginLeft: 17,
        marginRight: 25
    },
    btnPay: {
        height: 50,
        backgroundColor: Colors._DF1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    txtPay: {
        fontSize: 17,
        color: Colors.white
    },
    img5: {
        height: 25,
        width: 25
    },
    txt_support: {
        fontSize: 11,
        color: Colors.white,
        margin: 3
    },
    support: {
        position: 'absolute',
        top: 18,
        left: 170,
        backgroundColor: Colors._DF1,
        opacity: 0.4,
        borderRadius: 2
    }

});