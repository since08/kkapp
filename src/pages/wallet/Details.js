import React, {Component} from 'react';
import {
    FlatList, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {utcDate, isEmptyObject} from "../../utils/ComonHelper";
import {NavigationBar} from '../../components';
import {account_details, award_details} from "../../services/WallDao";
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';

export default class Details extends Component {

    _renderItem = (item, index) => {
        const {memo, amount, created_at} = item;

        return (
            <View style={styles.item}>
                <View style={styles.itemLeft}>
                    <Text style={{color: '#444444', fontSize: 14}}>{memo}</Text>
                    <Text style={{
                        color: '#AAAAAA',
                        fontSize: 12,
                        marginTop: 3
                    }}>{utcDate(created_at, 'YYYY-MM-DD hh:mm')}</Text>
                </View>
                <View style={{flex: 1}}/>
                <Text style={{
                    color: amount < 0 ? '#34BA3C' : "#E54A2E",
                    fontSize: 20,
                    marginRight: 17
                }}>{amount < 0 ? "" : "+"}{amount}元</Text>
            </View>
        )
    };
    _separator = () => {
        return <View style={{backgroundColor: '#F3F3F3', height: 2, width: '100%'}}/>
    }

    render() {
        return (

            <UltimateFlatList
                header={() => <View style={{height: 7, backgroundColor: Colors._ECE}}/>}
                style={{backgroundColor: 'white',paddingBottom:40}}
                ref={(ref) => this.listView = ref}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `IntegralDetailsPage${index}`}
                item={this._renderItem}
                separator={this._separator}
                refreshableTitlePull={I18n.t('pull_refresh')}
                refreshableTitleRelease={I18n.t('release_refresh')}
                dateTitle={I18n.t('last_refresh')}
                allLoadedText={I18n.t('no_more')}
                waitingSpinnerText={I18n.t('loading')}
                emptyView={() => <View/>}
            />
        )
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            if (this.props.type === 'WalletDetails') {
                account_details({page, page_size: 20}, data => {
                    console.log('wallet_details', data);
                    startFetch(data.items, 18)
                }, err => {
                    abortFetch()
                })
            } else if (this.props.type === 'AwardDetail') {
                award_details({page, page_size: 20}, data => {
                    console.log('award_details', data);
                    startFetch(data.items, 18)
                }, err => {
                    abortFetch()
                })
            }

        } catch (err) {
            abortFetch();
        }
    };

}


const styles = StyleSheet.create({
    nav: {
        height: Metrics.navBarHeight,
        width: '100%',
        backgroundColor: Colors._E54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Metrics.statusBarHeight
    },
    cancel: {
        fontSize: 14,
        color: Colors.white
    },
    title: {
        fontSize: 18,
        color: Colors.white
    },
    btn_search: {
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    View: {
        width: '100%'
    },
    item: {
        marginTop: 9,
        marginBottom: 7,
        flexDirection: 'row',

        alignItems: 'center'
    },
    itemLeft: {
        width: '66%',
        flexDirection: 'column',
        marginLeft: 17
    }

});