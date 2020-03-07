import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image,
    TouchableOpacity, Platform
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import propTypes from 'prop-types';
import {searchAllInfos} from '../../services/MacauDao'
import {isEmptyObject} from '../../utils/ComonHelper';
import {UltimateListView, ImageLoad} from '../../components'
import {LoadErrorView, NoDataView} from '../../components/load';
import {FoodItem} from '../macau/HotelSearch'

export default class InfoList extends Component {

    static propTypes = {
        isSearch: propTypes.bool
    };

    componentWillMount() {
        this.searchKey = '';
    }

    search = (keywords) => {
        this.searchKey = keywords;
        this.listView.refresh()
    };

    item_view=(item,index)=>{
        return <FoodItem
            key={`all${index}`}
            item={item}
            refresh={() => {
                this.listView.refresh()
            }}/>
    };

    separator=()=>{
        return <View style={{height:1,width:'100%',backgroundColor:'#F3F3F3'}}/>
    }

    render(){
        return(
            <View style={ApplicationStyles.bgContainer}>
                <UltimateListView
                    firstLoader={!this.props.isSearch}
                    separator={() => this.separator()}
                    keyExtractor={(item, index) => index + "item"}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    item={this.item_view}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                    emptyView={() => {
                        return <NoDataView/>;
                    }}
                />
            </View>
        )
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            if (this.props.isSearch){
                searchAllInfos({
                    page,
                    page_size: 20,
                    keyword: this.searchKey
                }, data => {
                    startFetch(data.items, 6)
                }, err => {
                    abortFetch()
                })
            }
            else{
                this.refresh(startFetch, abortFetch)
            }
        } catch (err) {
            abortFetch();
        }
    };
}