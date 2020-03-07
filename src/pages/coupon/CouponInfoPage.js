import React, {Component} from 'react';
import {
    FlatList, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity, ImageBackground
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {utcDate, isEmptyObject, mul, checkPriceLength} from "../../utils/ComonHelper";
import {NavigationBar} from '../../components';
import styles from './couponStyle';
import {getCouponInfos} from "../../services/MacauDao";

export default class CouponInfoPage extends Component {

    state = {
        coupon_infos: {}
    };

    componentDidMount() {
        this.refresh();
    };

    refresh = () => {
        getCouponInfos({coupon_number: this.props.params.item.coupon_number}, data => {
            console.log("coupon_infos:", data);
            this.setState({
                coupon_infos: data
            });
        }, err => {

        })

        //获取详情优惠券


    };

    render() {
        const {coupon_infos} = this.state;
        if (isEmptyObject(coupon_infos)) {
            return <View style={ApplicationStyles.bgContainer2}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={'使用规则'}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>
            </View>
        }
        const {telephone, address, begin_date, discount, discount_type, cover_link, end_date, name, short_desc, reduce_price, limit_price, coupon_type} = coupon_infos;
        return (
            <View style={ApplicationStyles.bgContainer2}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={'使用规则'}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <ScrollView>
                    <ImageBackground
                        style={styles.sameView2}
                        source={Images.coupon.background}>
                        <View style={styles.itemView}>
                            <View style={styles.itemLeft}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {discount_type === 'rebate' ?
                                        <Text style={{
                                            color: "#F34247",
                                            fontSize: 40,
                                            width: 100,
                                            fontWeight: 'bold'
                                        }}>{mul(discount, 10)}<Text
                                            style={{
                                                color: "#F34247",
                                                fontSize: 18,
                                                fontWeight: 'bold'
                                            }}>折</Text></Text> :

                                        <Text style={{color: "#F34247", fontSize: 18, width: 100}}>¥<Text
                                            style={{
                                                fontSize: checkPriceLength(reduce_price),
                                                fontWeight: 'bold'
                                            }}>{reduce_price}</Text></Text>}
                                    <View style={{width: '62%',marginLeft: 5}}>
                                        <Text style={{
                                            color: "#444444",
                                            fontSize: 18
                                        }}
                                              numberOfLines={2}>{name}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.txt1, {marginTop: 10}]}>{short_desc}</Text>
                                <Text style={[styles.txt1, {marginTop: 1}]}>{`有限期：${begin_date}至${end_date}`}</Text>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={{backgroundColor: 'white', marginTop: 19}}>
                        <View style={styles.info_item}>
                            <Text style={styles.text22}>折扣</Text>
                            <Text style={styles.text23} numberOfLines={1}>{short_desc}</Text>
                        </View>
                        <View style={styles.info_item}>
                            <Text style={styles.text22}>过期时间</Text>
                            <Text style={styles.text23} numberOfLines={1}>{end_date}</Text>
                        </View>
                        {coupon_type === 'offline_store' ? <View style={styles.info_item}>
                            <Text style={styles.text22}>地址</Text>
                            <Text style={styles.text23} numberOfLines={2}>{address}</Text>
                        </View> : null}

                        {coupon_type === 'offline_store' ? <View style={styles.info_item}>
                            <Text style={styles.text22}>电话</Text>
                            <Text style={styles.text23} numberOfLines={1}>{telephone}</Text>
                        </View> : null}

                    </View>
                </ScrollView>

                {coupon_type !== 'offline_store' ? <TouchableOpacity
                    style={[styles.infoBottom, {backgroundColor: '#E54A2E'}]}
                    activeOpacity={0}
                    onPress={() => {
                        if (coupon_type === 'hotel') {
                            router.pop();
                            global.router.toSelectTimePage();
                        } else if (coupon_type === 'shop') {
                            router.pop();
                            global.router.toMallPage();
                        }
                    }}>
                    <Text style={{color: "#FFFFFF", fontSize: 18}}>立即使用</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }


};
