import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import I18n from '../../../I18n/I18n';
import ProductItem from './ProductItem';
import CompletedBottom from './CompletedBottom';
import {getMallOrders} from '../../../services/MallDao';
import UltimateFlatList from '../../../components/ultimate';
import {BaseComponent} from '../../../components';

export default class OrderListStatus extends Component {


    renderItem = (item, index) => {
        const {order_number, status, total_price, order_items, final_price, deduction_result} = item;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    global.router.toMallOrderInfo(item, this.refresh)
                }}
                style={{flex: 1, marginTop: 5}}>
                <View style={styles.top}>
                    <Text style={styles.txtLeft}>{I18n.t('order_num')}：{order_number}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.txtRight}>{I18n.t(`${status}`)}</Text>
                </View>
                <View style={{height: 1}}/>
                <ProductItem
                    disabled={true}
                    lists={order_items}/>
                <View style={styles.viewTotal}>
                    <Text style={styles.txtTotal2}>{deduction_result === 'success' ? final_price : total_price}</Text>
                    <Text
                        style={styles.txtTotal1}>{order_items.length}{I18n.t('pieces')}{I18n.t('malls')} {I18n.t('order_total')}：¥</Text>
                </View>
                <CompletedBottom
                    pageOrderInfo={false}
                    refresh={this.refresh}
                    orderItem={item}/>
            </TouchableOpacity>
        )
    };

    refresh = () => {
        this.contain && this.contain.open();
        this.ultimate && this.ultimate.refresh();
    };


    render() {

        return <BaseComponent
            ref={ref => this.contain = ref}>
            <UltimateFlatList
                arrowImageStyle={{width: 20, height: 20, resizeMode: 'contain'}}
                ref={ref => this.ultimate = ref}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `${this.props.status}${index}`}
                item={this.renderItem}
                refreshableTitlePull={I18n.t('pull_refresh')}
                refreshableTitleRelease={I18n.t('release_refresh')}
                dateTitle={I18n.t('last_refresh')}
                allLoadedText={I18n.t('no_more')}
                waitingSpinnerText={I18n.t('loading')}
            />
        </BaseComponent>


    }

    onFetch = (page, postRefresh, endFetch) => {
        if (page === 1) {

            this.load({
                status: this.props.status,
                page: 1,
                page_size: 20
            }, postRefresh, endFetch)
        } else {
            this.load({
                status: this.props.status,
                page: page,
                page_size: 20
            }, postRefresh, endFetch)
        }

    };


    load = (body, postRefresh, endFetch) => {
        getMallOrders(body, data => {
            this.contain && this.contain.close();
            postRefresh(data.items, 18);

        }, err => {
            this.contain && this.contain.close();
            endFetch();
        });
    }
}
const styles = StyleSheet.create({
    top: {
        height: 40,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtLeft: {
        marginLeft: 17,
        fontSize: 14,
        color: '#333333'
    },
    txtRight: {
        marginRight: 16,
        fontSize: 14,
        color: '#333333'
    },
    viewTotal: {
        height: 44,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    txtTotal1: {
        color: '#333333',
        fontSize: 14
    },
    txtTotal2: {
        color: '#333333',
        fontSize: 18,
        marginRight: 18
    }
});