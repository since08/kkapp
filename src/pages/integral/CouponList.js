import React, {Component} from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Image
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import styles from './IntegralStyle'
import {catProducts, searchProducts} from "../../services/MallDao";

export default class CouponList extends Component {

    renderItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={[styles.listItem, index % 2 === 0 ? {} : {marginLeft: 8}]}
                              onPress={() => {
                                  global.router.toIntegralInfoPage(item)
                              }}>
                <Image style={[styles.marginS, styles.couponImg]} source={Images.integral.coupon}/>
                <Text style={[styles.TXt, styles.marginS, {marginTop: 16}]}>酒店优惠券</Text>
                <Text style={[styles.TXt2, styles.marginS]}>可抵扣50元</Text>
                <View style={[styles.marginS, {marginTop: 5, flexDirection: 'row'}]}>
                    <Text style={styles.TXt3}>100<Text style={styles.TXt4}>积分</Text></Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.TXt2}>剩余1件</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <UltimateFlatList
                // firstLoader={!this.props.isSearch}
                ref={(ref) => this.listView = ref}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `mallList${index}`}  //this is required when you are using FlatList
                item={this.renderItem}  //this takes two params (item, index)
                numColumns={2}
                refreshableTitlePull={I18n.t('pull_refresh')}
                refreshableTitleRelease={I18n.t('release_refresh')}
                dateTitle={I18n.t('last_refresh')}
                allLoadedText={I18n.t('no_more')}
                waitingSpinnerText={I18n.t('loading')}
                emptyView={() => <CouponEmpty/>}
            />
        )
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {

            if (page === 1) {
                this.refresh(1, startFetch, abortFetch)
            } else {
                this.refresh(page, startFetch, abortFetch);
            }
        } catch (err) {
            abortFetch();
        }
    };
    refresh = (page, startFetch, abortFetch) => {
        const {id} = this.props.category;
        catProducts({id}, data => {
            startFetch(this,props.category, 6)
        }, err => {
            abortFetch()
        }, {
            page: page,
            page_size: 20,
            category_id: id
        })
    };
}


export class CouponEmpty extends Component {

    render() {
        return (
            <View>
                <Text>空的</Text>
            </View>
        )
    }
}


