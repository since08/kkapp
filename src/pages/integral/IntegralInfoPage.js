import React, {Component} from 'react';
import {
    FlatList, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {utcDate, isEmptyObject, showToast, alertOrder, mul} from "../../utils/ComonHelper";
import {NavigationBar, BaseComponent, ImageLoad} from '../../components';
import styles from './IntegralStyle';
import {postExchangeCoupon, getIntegralInfo} from "../../services/IntegralDao";
import RenderHtml from '../comm/RenderHtml';
import {cancelHotelOrder} from "../../services/MacauDao";

export const tagStyles = {
    p: {
        color: "#666666",
        fontSize: 14,
        lineHeight: 20
    }
};

export default class IntegralInfoPage extends Component {

    state = {
        integral_info: {}
    }

    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        const {id} = this.props.params;
        getIntegralInfo({id: id}, data => {
            console.log("integral_info:", data)
            this.setState({
                integral_info: data
            })
        })
    }

    _exchange = (item, total_points) => {
        alertOrder("确认领取？", () => {
            postExchangeCoupon({coupon_id: this.props.params.id}, data => {
                showToast("领取成功");
                // this.contain && this.contain.close();
                // global.router.pop();
                this.refresh();
            }, err => {
                if (total_points < item.integrals) {
                    showToast("积分不足,领取失败")
                } else if (item.stock === 0) {
                    showToast("该优惠券被领完啦")
                }

            });
        });

    };
    _text = (stock, integrals, total_points) => {
        if (stock <= 0) {
            return '库存不足'
        } else if (total_points < integrals) {
            return '积分不足'
        } else {
            return '立即兑换'
        }
    };

    render() {
        const {total_points} = this.props.params;
        const {integral_info} = this.state;
        const {coupon_type, discount, name, integrals, expire_day, stock, description, reduce_price} = integral_info;
        return (
            <BaseComponent style={{flex: 1, backgroundColor: "#F3F3F3"}}
                           ref={ref => this.contain = ref}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._FFF}}
                    title={'积分详情'}
                    titleStyle={{color: Colors.txt_444, fontSize: 18}}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        this.props.params.refresh && this.props.params.refresh()
                        router.pop();

                    }}/>

                <ScrollView style={{flexDirection: 'column'}}>

                    <View style={[styles.infoPage, {marginTop: 1, paddingBottom: 15}]}>
                        <ImageLoad style={{alignSelf: 'center', marginTop: 28, height: 161, width: 265}}
                                   source={{uri: integral_info.cover_link}}/>
                        <Text style={[styles.marginS, styles.TXt, {marginTop: 21, fontWeight: 'bold'}]}>{name}</Text>
                        <View style={[styles.marginS, {marginTop: 5, flexDirection: 'row'}]}>
                            <Text style={styles.TXt3}>{integrals}<Text style={styles.TXt4}>积分</Text></Text>
                            <View style={{flex: 1}}/>
                            <Text style={styles.TXt2}>剩余{stock}件</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 18, marginLeft: 17, marginRight: 17, flexDirection: 'column'}}>
                        <Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold'}}>商品详情</Text>
                        {/*<RenderHtml*/}
                        {/*t˚agsStyles={tagStyles}*/}
                        {/*html={description}/>*/}
                        {discount > 0 ? <Text style={[styles.Txt5, {marginTop: 9}]}>优惠折扣：{mul(discount, 10)}折</Text> :
                            <Text style={[styles.Txt5, {marginTop: 9}]}>优惠面值：{reduce_price}元</Text>}

                        <Text style={styles.Txt5}>可使用于酒店预订付费减免</Text>
                        {/*<Text style={styles.Txt5}>使用条件：单笔酒店预订金额满900元</Text>*/}
                        <Text style={styles.Txt5}>有效期：{expire_day}天</Text>

                        <Text style={[styles.TXt4, {marginTop: 13, fontWeight: 'bold'}]}>兑换流程</Text>
                        <Text style={[styles.Txt5, {marginTop: 8}]}>1、点击「立即兑换」，抵扣券即时发放至兑换用户</Text>
                        <Text style={styles.Txt5}> 2、优惠券信息可在「个人中心」-我的优惠中查看</Text>

                        <Text style={[styles.TXt4, {marginTop: 14, fontWeight: 'bold'}]}>注意事项</Text>
                        <Text style={[styles.Txt5, {marginTop: 9}]}>1、此优惠券仅限兑换用户使用，兑换后积分不予退还 </Text>
                        <Text style={styles.Txt5}>2、如有疑问请联系客服0755-23919844</Text>

                    </View>
                    <View style={{height: 50}}/>

                </ScrollView>
                <TouchableOpacity
                    style={[styles.infoBottom, {backgroundColor: stock === 0 || total_points < integrals ? '#AAAAAA' : '#E54A2E'}]}
                    activeOpacity={0}
                    onPress={() => {
                        if (stock > 0 && total_points >= integrals) {
                            this._exchange(integral_info, total_points);
                        }
                    }}>
                    <Text style={{color: "#FFFFFF", fontSize: 18}}>{this._text(stock, integrals, total_points)}</Text>
                </TouchableOpacity>
            </BaseComponent>
        )
    }
}