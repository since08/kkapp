import React, {Component} from 'react';
import {
    FlatList, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {utcDate, isEmptyObject} from "../../utils/ComonHelper";
import ImageLoad from "../../components/ImageLoad";
import I18n from '../../I18n/I18n';
import UltimateFlatList from '../../components/ultimate/UltimateFlatList';
import {other_invite, user_invite} from "../../services/WallDao";

export default class InviteDetails extends Component {


    _renderItem = (item, index) => {
        const {user_id, nick_name, avatar} = item;
        const {type, next_step} = this.props;
        return (
            <TouchableOpacity style={styles.pageItem}
                              onPress={() => {
                                  if (type === '2' && next_step) {
                                      global.router.toOtherInvitePage(item)
                                  }
                              }}>

                <ImageLoad style={styles.avatar}
                           source={{uri: avatar}}/>

                <View style={{width: '50%'}}>
                    <Text style={styles.txt_name}>{nick_name}</Text>
                </View>
                <View style={{flex: 1}}/>

                {type === '2' ? <Text style={styles.txt_decs}>他的邀请</Text> : null}

                {type === '2' ? <Image style={styles.img_left}
                                       source={Images.adr_right}/> : null}
            </TouchableOpacity>
        )
    };

    _separator = () => {
        return <View style={{backgroundColor: '#F3F3F3', height: 2, width: '100%'}}/>
    };

    render() {
        return (

            <UltimateFlatList
                header={() => <View style={{height: 1, backgroundColor: Colors._ECE}}/>}

                style={{backgroundColor: 'white', paddingBottom: 80}}
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
            if (this.props.type === '2') {
                user_invite({page, page_size: 20}, data => {
                    this.props.changed_length(data.count);
                    console.log('user_invite', data);
                    startFetch(data.items, 18)

                }, err => {
                    abortFetch()
                })
            } else if (this.props.type === '3') {
                other_invite({target_id: this.props.user_id, page, page_size: 20}, data => {
                    this.props.changed_length(data.count);
                    console.log('别人的邀请好友', data);
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
    pageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 9,
        marginRight: 17,
        marginLeft: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3'

    },
    txt_num: {
        color: Colors._666,
        fontSize: 15,
        fontWeight: 'bold'
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 15
    },
    txt_name: {
        color: Colors._333,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2
    },
    txt_decs: {
        color: Colors._AAA,
        fontSize: 12
    },
    img_left: {
        height: 12,
        width: 6,
        marginLeft: 8
    },
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
        marginTop: 1,
        marginBottom: 7,
        flexDirection: 'row',

        alignItems: 'center'
    },
    itemLeft: {
        flexDirection: 'column',
        marginLeft: 17
    }

});