import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, Image, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from "../../I18n/I18n";
import propTypes from 'prop-types';
import {NavigationBar, BaseComponent, ImageLoad, UltimateListView} from '../../components';
import {getPersonDynamics, getUnreadComments} from '../../services/CommentDao';
import {
    agoDynamicDate,
    isEmptyObject,
    strNotNull,
    util,
    utcDate,
    convertDate,
    showToast
} from '../../utils/ComonHelper';
import DynamicEmpty from './DynamicEmpty';
import DynamicTopBar from './DynamicTopBar';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MomentList from '../socials/MomentList'
import PopAction from '../comm/PopAction';
import {report_topic} from "../../services/SocialDao";

let topicId = -1;

export default class PersonDynamicPage extends Component {
    state = {
        dynamics: {},
        unreadCount: 0
    };

    constructor(props) {
        super(props);
        const {userInfo} = this.props.params;
        if (userInfo) {
            this.userInfo = userInfo;
        } else {
            this.userInfo = global.login_user
        }

    }

    //举报原因
    report = (index) => {
        let reportList = global.reportList;
        let data = reportList[index];
        let body = {
            body: data.name,
            target_id: topicId,
            target_type: 'topic'
        };
        report_topic(body, (ret) => {
            showToast("举报成功");
        }, (err) => {
            console.log(err);
        });
        this.popAction && this.popAction.toggle();
    };

    //弹窗
    popActions = () => {
        let reportList = global.reportList;
        let resultArray = [];
        reportList.forEach((data, index) => {
            let item = {name: data.name, txtStyle: {color: '#4A90E2'}, onPress: () => this.report(index)};
            resultArray.push(item);
        });
        resultArray.push({
            name: I18n.t('cancel'),
            txtStyle: {color: Colors._AAA},
            onPress: () => this.popAction.toggle()
        });
        return resultArray;
    };


    setUnreadCount = (unreadCount) => {
        this.setState({
            unreadCount
        })

    };

    componentDidMount() {
        this.dynamicList = [];
        this.page = 1;
        this.unread()
    };

    unread = () => {
        if (this.isMine()) {
            let body = {user_id: this.userInfo.user_id};
            getUnreadComments(body, data => {
                console.log("unreadCount:", data.unread_count)
                this.setState({
                    unreadCount: data.unread_count
                })
            }, err => {

            });
        }

    };

    _avatar = (avatar) => {
        if (isEmptyObject(avatar))
            return Images.home_avatar;
        else if (strNotNull(avatar))
            return {uri: avatar}
        else
            return Images.home_avatar;
    };
    personTop = () => {

        const {avatar, nick_name, signature} = this.userInfo;
        return <View style={{height: 10, width: '100%', backgroundColor: Colors._ECE}}/>

        // return (
        //     <View>
        //         <LinearGradient
        //             colors={['#DEDEDE', '#FFFFFF', '#FFFFFF']}
        //             style={styles.topPage}>
        //             <TouchableOpacity
        //                 onPress={() => {
        //                     const images = [{url: avatar}];
        //                     global.router.toImageGalleryPage(images, 0)
        //                 }}>
        //                 <Image style={styles.TopImg} source={this._avatar(avatar)}/>
        //             </TouchableOpacity>
        //
        //             <View style={styles.TopTxt}>
        //                 <Text style={{fontSize: 20, color: '#444444'}}>{nick_name}</Text>
        //                 <Text
        //                     style={{
        //                         fontSize: 14,
        //                         color: '#888888',
        //                         marginTop: 5
        //                     }}>{isEmptyObject(signature) ? I18n.t('ple_sign') : signature}</Text>
        //             </View>
        //         </LinearGradient>
        //         <View style={{height: 6, width: '100%', backgroundColor: '#ECECEE'}}/>
        //     </View>
        // )
    };
    _separator = () => {
        return <View
            style={{height: 1, marginLeft: 78, marginRight: 17, backgroundColor: '#DDDDDD', marginBottom: 16}}/>;
    };
    _separator1 = () => {
        return <View style={{height: 1, marginLeft: 16, marginRight: 17, backgroundColor: '#DDDDDD'}}/>;
    };
    txtType = (item) => {
        const {topic_type, typological_type} = item;
        return I18n.t(topic_type + '_' + typological_type);
    };

    myComment = (item) => {
        const {typological, topic_type, typological_type} = item;
        const {my_name, my_comment_body, my_reply_body} = typological;
        return (
            <Text style={styles.itemTxt1}
                  numberOfLines={1}>{my_name}：{typological_type === "reply" ? my_reply_body : my_comment_body}</Text>
        )
    };

    renderItemTopic(item) {
        const {topic, typological_type, topic_type} = item;
        let {user, topic_id, cover_link, title, body, body_type} = topic;
        if (body_type === 'short') {
            title = body;
            cover_link = user.avatar;
        }

        return (
            <TouchableOpacity style={styles.itemPage}
                              onPress={() => {
                                  if (topic_type === "usertopic") {
                                      global.router.toLongArticle(topic)
                                  } else {
                                      console.log('足迹', topic)
                                      global.router.toDeletePage();
                                  }

                              }}>
                <Text style={[styles.itemTxt1, {marginBottom: 10}]}>{this.txtType(item)}</Text>

                <View style={styles.itemView}>

                    <ImageLoad style={styles.image} source={{uri: cover_link}}/>
                    <View style={styles.TxtRight}>

                        {typological_type === "topiclike" ? null :
                            this.myComment(item)
                        }
                        <Text style={styles.TxtRight2} numberOfLines={1}>{title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    option_content = (item) => {
        const {option_type, target_type} = item;
        if (target_type === 'topic') {
            switch (option_type) {
                case 'like':
                    return '我点赞了';
                case 'reply':
                    return '我回复了';
                case 'comment':
                    return '我评论了';
            }
        }

        if (target_type === 'info') {
            switch (option_type) {
                case 'like':
                    return '我点赞了';
                case 'reply':
                    return '我回复了';
                case 'comment':
                    return '我评论了';
            }
        }
        if (option_type === 'follow')
            return '我关注了';

        return '未录入类型'

    }

    option_desc = (item) => {
        const {option_type, target_type} = item;
        if (target_type === 'topic') {
            switch (option_type) {
                case 'like':
                    return item.topic.body_type === 'short' ? '说说' : '长帖';
                case 'reply':
                    return item.reply.body;
                case 'comment':
                    return item.comment.body;
            }
        }
        if (target_type === 'info') {
            switch (option_type) {
                case 'like':
                    return '';
                case 'reply':
                    return item.reply.body;
                case 'comment':
                    return item.comment.body;
            }
        }

        if (option_type === 'follow')
            return item.target_user.nick_name


        return '未录入类型标题'
    }

    option_title = (item) => {
        const {option_type, target_type} = item;
        if (target_type === 'topic') {
            switch (option_type) {
                case 'like':
                    return item.topic.body_type === 'short' ? item.topic.body : item.topic.title;
                case 'reply':
                    return item.reply.topic.title;
                case 'comment':
                    return item.comment.topic.title;
            }
        }
        if (target_type === 'info') {
            switch (option_type) {
                case 'like':
                    return item.info.title;
                case 'reply':
                    return item.reply.info.title;
                case 'comment':
                    return item.comment.info.title;
            }
        }

        if (option_type === 'follow')
            return item.target_user.signature


        return '未录入类型标题'
    };

    option_image = (item) => {
        const {option_type, target_type} = item;
        if (target_type === 'topic') {
            switch (option_type) {
                case 'like':
                    return item.topic.cover_link;
                case 'reply':
                    return item.reply.topic.cover_link;
                case 'comment':
                    return item.comment.topic.cover_link;
            }
        }
        if (target_type === 'info') {
            switch (option_type) {
                case 'like':
                    return item.info.preview_image;
                case 'reply':
                    return item.reply.info.preview_image;
                case 'comment':
                    return item.comment.info.preview_image;
            }
        }

        if (option_type === 'follow')
            return item.target_user.avatar


        return '未录入类型标题'
    }

    option_click = (item) => {
        const {option_type, target_type} = item;
        if (target_type === 'topic') {
            switch (option_type) {
                case 'like':
                    router.toLongArticle(item.topic)
                    return
                case 'reply':
                    router.toLongArticle(item.reply.topic)
                    return;
                case 'comment':
                    router.toLongArticle(item.comment.topic)
                    return
            }
        }
        if (target_type === 'info') {
            switch (option_type) {
                case 'like':
                    router.toInfoPage(item.info)
                    return
                case 'reply':
                    router.toInfoPage(item.reply.info)
                    return;
                case 'comment':
                    router.toInfoPage(item.comment.info)
                    return
            }
        }

        if (option_type === 'follow') {
            router.toUserTopicPage(item.target_user)
            return
        }


        return '未录入类型标题'
    };


    renderItem = ({item}) => {

        if (item.target_type === "nil_class")
            return <View/>
        else
            return (
                <TouchableOpacity style={styles.itemPage}
                                  onPress={() => {
                                      this.option_click(item)
                                  }}>
                    <Text style={[styles.itemTxt1, {marginBottom: 10}]}>{this.option_content(item)}</Text>

                    <View style={styles.itemView}>

                        <ImageLoad style={styles.image}
                                   source={{uri: this.option_image(item)}}/>
                        <View style={styles.TxtRight}>

                            <Text style={styles.itemTxt1}
                                  numberOfLines={1}>{this.option_desc(item)}</Text>
                            <Text style={styles.TxtRight2} numberOfLines={1}>{this.option_title(item)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )


    };


    content = (item, index, separators) => {
        let timestamp2 = Date.parse(new Date(item.date));
        timestamp2 = timestamp2 / 1000;


        return (
            <FlatList
                data={item.items}
                ListHeaderComponent={() => {
                    return <Text style={styles.time}>{agoDynamicDate(timestamp2)}</Text>
                }}
                keyExtractor={(item, index) => `topic${index}`}
                renderItem={this.renderItem}
                ItemSeparatorComponent={this._separator}
            />


        )
    };


    onFetch = (page, postRefresh, endFetch) => {
        if (page === 1) {
            this.dynamicList = [];
            this.page = 1;
        }
        this.loadDynamics(this.page, postRefresh, endFetch)

    };

    blobData = (items) => {
        let objArr = {};
        let dynamics = [];
        util.forEach(items, item => {
            let date = utcDate(item.created_at, 'YYYY-MM-DD');

            if (!objArr[date]) {
                objArr[date] = [];
            }
            objArr[date].push(item);
        });

        util.forEach(objArr, (value, key) => {
            let dynamic = {
                date: key,
                items: value
            };
            dynamics.push(dynamic)
        });

        console.log("dynamics:", dynamics);

        return dynamics;

    };


    loadDynamics = (page, postRefresh, endFetch) => {
        let body = {user_id: this.userInfo.user_id, page, page_size: 20};
        getPersonDynamics(body, data => {
            this.dynamicList = util.concat(this.dynamicList, data.items);
            if (this.ultimate) {
                if (data.items.length > 0) {
                    this.page += 1;
                }
                this.ultimate.setPage(this.page);
                this.ultimate.updateRows(this.blobData(this.dynamicList), data.items.length === 0 ? 2 : 1)
            }


        }, err => {
            endFetch();
        });
    };


    isMine = () => {
        const {userInfo} = this.props.params;
        return userInfo.user_id === global.login_user.user_id;
    };

    tabLabel = (type) => {
        if (type === 'user_topics')
            return I18n.t('dynamic')
        else if (type === 'short')
            return I18n.t('moment')
        else if (type === 'long')
            return I18n.t('topic')
    }

    render() {
        const {user_id} = this.userInfo;
        const {scrollEnabled, scrollTop} = this.props;
        const lists = this.isMine() ? ['user_topics'] : ['user_topics', 'long', 'short'];
        let moments = lists.map((item, index) => {

            return <MomentList
                scrollEnabled={scrollEnabled}
                ref={'MomentList' + index}
                key={'moments' + index}
                userId={user_id}
                tabLabel={this.tabLabel(item)}
                type={item}
                showMore={(id) => {
                    topicId = id;
                    this.popAction && this.popAction.toggle();
                }}/>
        });


        return (
            <View style={[{flex: 1}]}>
                <ScrollableTabView
                    renderTabBar={() => <DynamicTopBar
                        scrollTop={scrollTop}
                        nickname={this.userInfo.nick_name}
                        setUnreadCount={this.setUnreadCount}
                        unreadCount={this.state.unreadCount}
                        hideReceived={this.isMine()}
                        count={this.state.dynamics.length}/>}>

                    {moments}

                    {this.isMine() ? <UltimateListView
                        scrollEnabled={scrollEnabled}
                        style={{backgroundColor: 'white'}}
                        tabLabel={I18n.t('footprint')}
                        header={() => this.personTop()}
                        ref={ref => this.ultimate = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `replies${index}`}
                        item={this.content}
                        refreshableTitlePull={I18n.t('pull_refresh')}
                        refreshableTitleRelease={I18n.t('release_refresh')}
                        dateTitle={I18n.t('last_refresh')}
                        allLoadedText={I18n.t('no_more')}
                        waitingSpinnerText={I18n.t('loading')}
                        separator={this._separator1}
                        emptyView={() => <DynamicEmpty/>}
                    /> : null}


                </ScrollableTabView>

                <PopAction
                    ref={ref => this.popAction = ref}
                    btnArray={this.popActions()}
                />
            </View>
        );
    }


}

const styles = StyleSheet.create({

    topPage: {
        width: Metrics.screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 24,
        backgroundColor: '#DEDEDE',
        marginBottom: 6
    },
    TopImg: {
        width: 74,
        height: 74,
        marginLeft: 24,
        borderRadius: 37
    },
    TopTxt: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 21,
        backgroundColor: 'transparent'
    },
    itemsView: {
        paddingTop: 5
    },
    time: {
        fontSize: 20,
        color: '#444444',
        marginLeft: 17,
        marginTop: 15,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    itemPage: {
        marginLeft: 78,
        marginTop: 1,
        marginRight: 17,
        marginBottom: 15
    },
    itemTxt1: {
        fontSize: 14,
        color: '#444444',

    },
    itemView: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F5F5F5',
        borderRadius: 1
    },
    image: {
        width: 48, height: 48,
        marginLeft: 6,
        marginTop: 6
    },
    TxtRight: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 12,
        marginTop: 10,
        marginRight: 55
    },
    TxtRight2: {
        fontSize: 14,
        color: '#AAAAAA',
        marginTop: 4

    },
    commentWhiteView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    commentWhite: {
        width: 22,
        height: 20
    }

});