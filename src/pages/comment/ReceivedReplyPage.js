import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, TextInput, Modal, Platform} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from "../../I18n/I18n";
import {NavigationBar, BaseComponent} from '../../components';
import UltimateFlatList from '../../components/ultimate';
import {getReceivedReply} from '../../services/CommentDao';
import {getDateDiff, isEmptyObject, strNotNull, utcDate} from '../../utils/ComonHelper';
import DynamicEmpty from './DynamicEmpty';

export default class ReceivedReplyPage extends Component {


    componentDidMount() {

    };

    _separator = () => {
        return <View
            style={{height: 1, marginLeft: 14, marginRight: 17, backgroundColor: '#DDDDDD'}}/>;
    };
    onFetch = (page, postRefresh, endFetch) => {
        let body = {user_id: global.login_user.user_id, page: page, page_size: 10};
        getReceivedReply(body, data => {
            console.log("receivedReply:", data);
            postRefresh(data.notifications, 9);

        }, err => {
            endFetch();
        });

    };
    official = () => {
        return (
            <View style={styles.officialView}>
                <Text style={styles.officialTxt}>{I18n.t('official')}</Text>
            </View>
        )
    };

    _avatar = (avatar) => {
        if (strNotNull(avatar))
            return {uri: avatar}
        return Images.home_avatar

    };

    notifyType = (notify_type) => {
        switch (notify_type) {
            case 'reply':
                return I18n.t('reply') + ":"
            case "comment":
                return I18n.t('comment') + ":"
            case 'like':
                return I18n.t('liked')
            // case 'follow':
            //     return "关注了你"
        }
    }

    type_topic = (item) => {
        const {notify_type} = item;
        switch (notify_type) {
            case 'reply':
                return item.reply.topic;
            case "comment":
                return item.comment.topic;
            case 'like':
                return item.topic;
        }
    }

    type_body = (item) => {
        const {notify_type} = item;
        switch (notify_type) {
            case 'reply':
                return item.reply.body;
            case "comment":
                return item.comment.body;
        }
    }
    toUserPage = (user) => {
        if (!isEmptyObject(login_user) && user.user_id === login_user.user_id) {
            global.router.toPersonDynamic(user)
        } else {
            global.router.toUserTopicPage(user)
        }

    };

    renderItem = (item, index) => {

        const {created_at, from, notify_type} = item;
        const {avatar, nick_name, official} = from.target_user;
        if (notify_type === "follow") {
            return
        }
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        if (notify_type === "follow") {
                            this.toUserPage(from.target_user)
                        } else {
                            global.router.toLongArticle(this.type_topic(item))
                        }
                    }
                    }
                    style={styles.itemPage}>
                    <Image style={styles.personImg} source={this._avatar(avatar)}/>
                    <View style={styles.pageRight}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6}}>
                            <Text style={[styles.name, {width: '55%'}]}>{nick_name}</Text>
                            {official ? this.official() : null}
                            <View style={{flex: 1}}/>
                            <Text style={styles.time}>{utcDate(created_at, 'YYYY-MM-DD HH:mm')}</Text>
                        </View>

                        <View style={styles.replyView}>
                            <Text style={styles.replyTxt1}>
                                {this.notifyType(notify_type)}
                            </Text>

                            {notify_type !== 'like' ? <Text
                                style={styles.replyTxt1}>
                                {this.type_body(item)}
                            </Text> : null}

                        </View>
                    </View>
                </TouchableOpacity>
                {this._separator()}
            </View>
        )
    };

    render() {
        return (
            <BaseComponent style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                    toolbarStyle={{backgroundColor: Colors.white}}
                    title={I18n.t('received_reply')}
                    titleStyle={{color: Colors._E54}}
                    leftBtnIcon={Images.mall_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
                    <UltimateFlatList
                        header={() => <View style={{height: 7, width: '100%', backgroundColor: '#ECECEE'}}/>}
                        arrowImageStyle={{width: 20, height: 20, resizeMode: 'contain'}}
                        ref={ref => this.ultimate = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `replies${index}`}
                        item={this.renderItem}
                        refreshableTitlePull={I18n.t('pull_refresh')}
                        refreshableTitleRelease={I18n.t('release_refresh')}
                        dateTitle={I18n.t('last_refresh')}
                        allLoadedText={I18n.t('no_more')}
                        waitingSpinnerText={I18n.t('loading')}
                        emptyView={() => <DynamicEmpty/>}
                    />

                </View>


            </BaseComponent>
        );
    }


}

const styles = StyleSheet.create({

    itemPage: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 17,
        paddingBottom: 10


    },
    personImg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginLeft: 17
    },
    pageRight: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 11,
        flex: 1
    },
    name: {
        fontSize: 14,
        color: '#666666'
    },
    time: {
        fontSize: 12,
        color: '#AAAAAA'
    },

    topicTxt: {
        fontSize: 14,
        color: '#AAAAAA',
        marginLeft: 11,
        marginRight: 8
    },
    replyView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    replyTxt1: {
        fontSize: 15,
        color: '#444444'

    },
    replyTxt2: {
        color: '#4990E2',
        fontSize: 15
    },
    officialView: {
        width: 32,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161718',
        borderRadius: 2
    },
    officialTxt: {
        fontSize: 10,
        color: '#FFE9AD',
    }
});