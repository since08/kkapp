import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import I18n from '../../../I18n/I18n';
import HotelItem from './HotelItem';
import UltimateFlatList from '../../../components/ultimate';
import {BaseComponent} from '../../../components';
import {HotelStatus, hotleStatus} from "../../../configs/Status";
import {getHotelOrderList} from '../../../services/MacauDao';

export default class HotelOrderListStatus extends Component {
    _color = (status) => {
        if (status === HotelStatus.unpaid) {
            return "#E54A2E"
        } else if (status === HotelStatus.unpaid) {
            return "#4A90E2"
        } else {
            return "#333333"
        }
    };

    renderItem = (item, index) => {

        const {status, order_number,pay_status,status_text} = item.order;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    global.router.toOrderStatusPage(order_number,this.refresh)
                }}
                style={{flex: 1, marginTop: 5}}>
                <View style={styles.top}>
                    <Text style={styles.txtLeft}>{`订单编号：${order_number}`}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.txtRight, {color: this._color(pay_status)}]}>{status_text}</Text>
                </View>
                <View style={{height: 1}}/>
                <HotelItem
                    item={item}
                    refresh={this.refresh}/>
            </TouchableOpacity>
        )
    };

    refresh = () => {
        // this.contain && this.contain.open();
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

        try {
            if (page === 1) {
                this.load({
                    status: this.props.status,
                    page: page,
                    page_size: 20
                }, postRefresh, endFetch)
            } else {
                postRefresh([], 15)
            }


        } catch (e) {
            this.contain && this.contain.close();
            endFetch()
        }

    };


    load = (body, postRefresh, endFetch) => {
        getHotelOrderList(body, data => {
            this.contain && this.contain.close();
            console.log("hotelOrderItems", data)
            postRefresh(data.items, 15)
        }, err => {
            this.contain && this.contain.close();
            endFetch()
        })
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