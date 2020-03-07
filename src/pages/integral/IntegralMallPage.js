import React, {Component} from 'react';
import {
    TouchableOpacity, Text, View, ScrollView, Image, ImageBackground
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {getIntrgralMall} from '../../services/IntegralDao';
import IntegralBar from './IntegralBar';
import styles from './IntegralStyle'
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import {ImageLoad,BaseComponent} from '../../components'

export default class IntegralMallPage extends Component {

    state = {
        integral_mall: {}
    };


    renderItem = (item, index) => {
        const {coupon_type, name, integrals, short_desc, stock} = item;
        return (
            <TouchableOpacity key={index} style={[styles.listItem, index % 2 === 0 ? {} : {marginLeft: 8}]}
                              onPress={() => {
                                  global.router.toIntegralInfoPage(item.id, this.props.params.total_points,this.refresh)
                              }}>
                {/*<ImageBackground style={[styles.marginS, styles.couponImg,{flexDirection:'row',alignItems:'center'}]}>*/}
                {/*<View style={styles.itemLeft}>*/}
                {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                {/*<Text style={{color: "#F34247", fontSize: 18}}>¥<Text*/}
                {/*style={{fontSize: 50, fontWeight: 'bold'}}>50</Text></Text>*/}
                {/*<Text style={{color: "#444444", fontSize: 20, marginLeft: 22}}>酒店优惠券</Text>*/}
                {/*</View>*/}
                {/*<Text style={[styles.txt1, {marginTop: 10}]}>单笔酒店预订金额满800元可使用</Text>*/}
                {/*<Text style={[styles.txt1, {marginTop: 1}]}>有限期：2018-06-21至06-31</Text>*/}
                {/*</View>*/}
                {/*</ImageBackground>*/}
                <ImageLoad style={[styles.marginS, styles.couponImg]} source={{uri: item.cover_link}}/>
                <Text style={[styles.TXt, styles.marginS, {marginTop: 16}]}>{name}</Text>
                {/*<Text style={[styles.TXt2, styles.marginS]}>可抵扣50元</Text>*/}
                <View style={[styles.marginS, {marginTop: 5, flexDirection: 'row'}]}>
                    <Text style={styles.TXt3}>{integrals}<Text style={styles.TXt4}>积分</Text></Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.TXt2}>剩余{stock}件</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <BaseComponent style={ApplicationStyles.bgContainer}
                            ref={ref => this.contain = ref}>
                <IntegralBar text={'积分商城'}/>
                <UltimateFlatList
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `mallList${index}`}
                    item={this.renderItem}
                    numColumns={2}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                    emptyView={() => <CouponEmpty/>}
                />
            </BaseComponent>
        )
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {

            if (page === 1) {
                this.load(1, startFetch, abortFetch)
            } else {
                this.load(page, startFetch, abortFetch);
            }
        } catch (err) {
            abortFetch();
        }
    };

    refresh = () => {
        this.contain && this.contain.open();
        this.listView && this.listView.refresh();
    };

    load = (page, startFetch, abortFetch) => {

        getIntrgralMall(data => {
            this.contain && this.contain.close();
            startFetch(data.items, 18)
        }, err => {
            abortFetch()
        }, {
            page: page,
            page_size: 20
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

