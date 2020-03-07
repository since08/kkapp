import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, InteractionManager, FlatList
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import RenderHtml from '../comm/RenderHtml';
import {getHotlines} from '../../services/MacauDao'
import RenderItem from './RenderItem';
import styles from './fastStyles'
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import {logMsg, strNotNull} from "../../utils/ComonHelper";

export default class FastFoodPage extends Component {

    constructor(props) {
        super(props)
        this.type = props.params.type;
    }

    _separator = () => {
        return (
            <View style={{height: 1, width: '100%', backgroundColor: '#F3F3F3'}}/>
        )
    };

    _renderItem = (item, index) => {
        return <RenderItem item={item}/>
    };

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {

            this.refresh(page, startFetch, abortFetch);
        } catch (err) {
            abortFetch();
        }
    };

    _onRefresh = () => {
        this.listView && this.listView.close()
    };

    refresh = (page, startFetch, abortFetch) => {


        getHotlines({page: page, page_size: 20, line_type: this.type}, data => {
            logMsg("Hotlines_type:", this.type);
            logMsg("Hotlines:", data);
            startFetch(data.items, 16)
        }, err => {
            abortFetch();
        })
    };

    render() {

        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    title={this.type === 'fast_food' ? '快餐热线' : '便民电话'}
                    toolbarStyle={{
                        backgroundColor: Colors._E54
                    }}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}
                />
                <UltimateFlatList
                    firstLoader={true}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `FastFoodPage${index}`}  //this is required when you are using FlatList
                    item={this._renderItem}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                    separator={this._separator}
                    emptyView={() => <View  style={{alignItems:'center',justifyContent:'center'}}><Text>暂无信息</Text></View>}
                />

            </View>
        )
    }
}
