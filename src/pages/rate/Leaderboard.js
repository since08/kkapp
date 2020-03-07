import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image,
    TouchableOpacity, Platform, FlatList
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import propTypes from 'prop-types';
import {isEmptyObject, logMsg} from '../../utils/ComonHelper';
import {getExchange_traders} from "../../services/MacauDao";
import styles from '../macau/Styles';
import ImageLoad from "../../components/ImageLoad";

export default class Leaderboard extends Component {

    static propTypes = {
        category: propTypes.object
    };

    state = {
        exchange_traders: []
    };

    constructor(props){
        super(props)
        this.trade_type = props.category.type;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.category.type !== this.props.category.type){
            this.trade_type = newProps.category.type;
            this._onRefresh()
        }

    }


    show_index = (index) => {
        if (index === 0) {
            return <Image style={{width: Metrics.reallySize(18), height: Metrics.reallySize(25)}} source={Images.one1}/>
        } else if (index === 1) {
            return <Image style={{width: Metrics.reallySize(18), height: Metrics.reallySize(25)}} source={Images.two}/>
        } else if (index === 2) {
            return <Image style={{width: Metrics.reallySize(18), height: Metrics.reallySize(25)}}
                          source={Images.three}/>
        } else {
            return <Text style={[styles.txt_num, {width: 18}]}>{index + 1}</Text>
        }
    };

    toUserPage = (user) => {
        if (!isEmptyObject(login_user) && user.user_id === login_user.user_id) {
            global.router.toPersonDynamic(user)
        } else {
            global.router.toUserTopicPage(user)
        }

    };

    _renderItem = (item, index) => {
        const {avatar, mobile, nick_name, signature, user_id} = item;
        return (
            <TouchableOpacity style={styles.pageItem}
                              onPress={() => {
                                  this.toUserPage(item)
                              }}>

                {this.show_index(index)}

                <ImageLoad style={styles.avatar}
                           source={{uri: avatar}}/>

                <View style={{width: '50%'}}>
                    <Text style={styles.txt_name}>{nick_name}</Text>
                    <Text style={[styles.txt_decs, {marginTop: 2}]}>{signature}</Text>
                </View>

                <View style={{flex: 1}}/>

                <Text style={styles.txt_decs}>联系他</Text>

                <Image style={styles.img_left}
                       source={Images.adr_right}/>

            </TouchableOpacity>
        )
    };

    render() {
        return (this.renderFlatList())

    }

    renderFlatList = () => {
        return <UltimateFlatList
            firstLoader={true}
            ref={(ref) => this.listView = ref}
            onFetch={this.onFetch}
            keyExtractor={(item, index) => `Leaderboard${index}`}  //this is required when you are using FlatList
            item={this._renderItem}  //this takes two params (item, index)
            refreshableTitlePull={I18n.t('pull_refresh')}
            refreshableTitleRelease={I18n.t('release_refresh')}
            dateTitle={I18n.t('last_refresh')}
            allLoadedText={I18n.t('no_more')}
            waitingSpinnerText={I18n.t('loading')}
            emptyView={() => <View/>}
        />


    };


    _onRefresh = () => {
        this.listView && this.listView.refresh()
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {

            this.refresh(page, startFetch, abortFetch);
        } catch (err) {
            abortFetch();
        }
    };


    refresh = (page, startFetch, abortFetch) => {


        getExchange_traders({page: page, page_size: 20, trader_type: this.trade_type}, data => {
            console.log("trader_type:", this.trade_type);
            console.log("exchange_traders:", data);
            startFetch(data.items, 16)
        }, err => {
            abortFetch()
        })
    };
}