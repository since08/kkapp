import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import {reallySize} from "./Header";
import {UltimateListView, ImageLoad, LeftAlignedImage} from '../../components'
import I18n from '../../I18n/I18n';
import {NoDataView, LoadErrorView} from '../../components/load';
import {Colors, Images} from '../../Themes';
import {
    getDateDiff, alertOrder, strNotNull, isEmptyObject,
    getFileMine
} from '../../utils/ComonHelper';
import {
    topics_recommends, topics,
    topics_like, user_topics, topics_delete,
    topics_search, my_foucs
} from '../../services/SocialDao';
import {getMsgUnRead} from "../../services/AccountDao";

export const styles = StyleSheet.create({
    avatar: {
        height: reallySize(38),
        width: reallySize(38),
        borderRadius: reallySize(19)
    },
    nick_name: {
        color: Colors._666,
        fontSize: reallySize(15)
    },
    user: {
        height: reallySize(60),
        marginRight: 17,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: reallySize(17)
    },
    item: {
        backgroundColor: 'white'
    },
    more_3: {
        height: reallySize(20),
        width: reallySize(20),
        resizeMode: "contain",
    },
    body: {
        color: Colors.txt_444,
        fontSize: reallySize(16),
        paddingRight: reallySize(17),
        paddingLeft: reallySize(17),
        lineHeight: 18
    },
    bottom: {
        height: reallySize(38),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: reallySize(17),
        paddingLeft: reallySize(17)
    },
    time: {
        fontSize: reallySize(12),
        color: Colors._AAA
    },
    separator: {
        height: reallySize(5),
        backgroundColor: Colors._ECE,
        width: '100%'
    },
    separator1: {
        height: reallySize(1),
        backgroundColor: Colors._ECE,
        width: '100%'
    },
    like: {
        height: reallySize(15),
        width: reallySize(15)
    },
    long_cover: {
        marginLeft: reallySize(17),
        marginTop: reallySize(8),
        marginRight: reallySize(17)
    },
    btn_like: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt_long: {
        color: '#F07F4D',
        borderRadius: 2,
        fontSize: reallySize(12),
        borderColor: '#F07F4D',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        marginRight: 12
    },
    short_image: {
        height: reallySize(108),
        width: reallySize(108),
        marginTop: reallySize(9),
        marginLeft: reallySize(9),
        backgroundColor: Colors._ECE
    },
    comment: {
        height: reallySize(16),
        width: reallySize(17)
    },
});

export default class MomentList extends PureComponent {

    static props = {
        showMore: null
    };

    _count=(count)=>{
        if(count > 99){
            return '99+'
        }else{
            return count
        }
    }

    header = () => {
        return (
            <View style={{
                backgroundColor: 'white',
                width: '100%',
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.props.unread_count > 0 ? <TouchableOpacity style={{
                    backgroundColor: 'rgba(0,93,255,0.48)',
                    height: 28,
                    width: 122,
                    borderRadius: 4,
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginTop: 5
                }}
                                                                 onPress={() => {
                                                                     this.props.setUnreadCount && this.props.setUnreadCount(0);
                                                                     global.router.toReceivedReply();
                                                                     this.setState({
                                                                         unreadCount: 0
                                                                     })

                                                                 }}>

                    <Text>{`${this._count(this.props.unread_count)}条未读消息`}</Text>
                    <Image source={Images.is} style={{width:5,height:10,marginLeft:3}}/>
                </TouchableOpacity> : null}
                <View style={styles.separator1}/>
            </View>
        )
    }

    render() {
        return <UltimateListView
            header={this.header}
            scrollEnabled={this.props.scrollEnabled}
            keyExtractor={(item, index) => index + "_moment"}
            ref={(ref) => this.listView = ref}
            onFetch={this.onFetch}
            separator={() => <View style={styles.separator}/>}
            item={this.itemView}
            refreshableTitlePull={I18n.t('pull_refresh')}
            refreshableTitleRelease={I18n.t('release_refresh')}
            dateTitle={I18n.t('last_refresh')}
            allLoadedText={I18n.t('no_more')}
            waitingSpinnerText={I18n.t('loading')}
            emptyView={() => {
                return <NoDataView/>
            }}/>
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        const {type, userId} = this.props
        if (type === 'topics')
            topics({page, page_size: 20}, data => {
                startFetch(data.items, 15)
            }, err => {
                abortFetch()
            })
        if (type === 'recommends')
            topics_recommends({page, page_size: 20}, data => {
                startFetch(data.items, 15)
            }, err => {
                abortFetch()
            })
        if (type === 'user_topics') {
            user_topics({page, page_size: 20, user_id: userId}, data => {
                startFetch(data.items, 15)
            }, err => {
                abortFetch()
            })
        }
        if (type === 'long' ||
            type === 'short') {
            topics_search(userId, data => {
                startFetch(data.items, 15)
            }, err => {
                abortFetch()
            }, {type})
        }

        if (type === 'follows') {
            my_foucs({page, page_size: 20}, data => {
                startFetch(data.items, 15)
            }, err => {
            })
        }

    };

    isDelete = () => {
        const {type, userId} = this.props;
        if (userId && userId === global.login_user.user_id &&
            type === 'user_topics')
            return true;
        else
            return false;
    };

    toUserPage = (user) => {
        if (!isEmptyObject(login_user) && user.user_id === login_user.user_id) {
            global.router.toPersonDynamic(user)
        } else {
            global.router.toUserTopicPage(user)
        }

    };

    itemView = (item) => {
        const {
            user, created_at, total_likes, total_comments, id, body_type, location, current_user_liked,
            excellent
        } = item;
        const {address_title} = location;
        return <TouchableOpacity
            onPress={() => {
                router.toLongArticle(item)
            }}
            activeOpacity={1}
            style={styles.item}>

            <View/>
            {/*用户数据*/}
            <View style={styles.user}>
                <TouchableOpacity
                    onPress={() => {
                        this.toUserPage(user)
                    }}>
                    <ImageLoad
                        emptyBg={Images.home_avatar}
                        style={styles.avatar}
                        source={{uri: user.avatar}}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{marginLeft: 14, width: '47%', marginRight: 17}}
                    onPress={() => {
                        this.toUserPage(user)
                    }}>
                    <Text style={styles.nick_name}>{user.nick_name}</Text>
                </TouchableOpacity>

                <View style={{flex: 1}}/>

                {excellent ?
                    <Text style={[styles.txt_long, {color: '#F24A4A', borderColor: '#F24A4A'}]}>精选</Text> : null}
                {body_type === 'long' ? <Text style={styles.txt_long}>长帖</Text> : null}

                <TouchableOpacity
                    style={{paddingTop: 5, paddingBottom: 5, paddingRight: 5, paddingLeft: 5}}
                    onPress={() => {
                        if (this.isDelete()) {

                            alertOrder(I18n.t('verified_del'), () => {
                                topics_delete(id, data => {

                                    this.listView && this.listView.refresh()
                                }, err => {
                                })
                            })

                        }
                        else {
                            if (this.props.showMore === null) return;
                            this.props.showMore(id);
                        }
                    }}
                >
                    {this.isDelete() ? <Image style={{height: 19, width: 14, padding: 8}}
                                              source={Images.social.article_delete}/>
                        : <Image
                            style={styles.more_3}
                            source={Images.social.more_3}/>}
                </TouchableOpacity>


            </View>

            {/*内容*/}
            {this.bodyTypes(item)}

            {/*帖子时间、地点*/}
            <View style={styles.bottom}>
                <Text
                    style={styles.time}>{getDateDiff(created_at)}{strNotNull(address_title) ? `·${address_title}` : ""}</Text>

                <View style={{flex: 1}}/>
                <TouchableOpacity
                    onPress={() => {
                        topics_like({
                            target_id: id,
                            target_type: 'topic',
                            current_user_liked
                        }, data => {
                            item.total_likes = data.total_likes;
                            item.current_user_liked = !current_user_liked;
                            this.listView && this.listView.updateDataSource(this.listView.getRows())

                        }, err => {
                            console.log(err)
                        })
                    }}
                    style={styles.btn_like}>
                    <Image
                        style={styles.like}
                        source={current_user_liked ? Images.social.like_red : Images.social.like_gray}/>
                    <Text style={[styles.time, {marginLeft: 4, marginRight: 25}]}>{total_likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        router.toLongArticle(item, true)
                    }}
                    style={styles.btn_like}>
                    <Image
                        style={styles.comment}
                        source={Images.social.comment_gray}/>
                    <Text style={[styles.time, {marginLeft: 4}]}>{total_comments}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

    }

    bodyTypes = (item) => {
        switch (item.body_type) {
            case "long":
                return this.long(item)
            case "short":
                return this.short(item)
        }
    }

    long = (item) => {
        let title2 = item.title;
        return <View>
            <Text style={styles.body}>{title2}</Text>

            {strNotNull(item.cover_link) ? <View
                style={styles.long_cover}
            >
                <LeftAlignedImage

                    source={{uri: item.cover_link}}/>
            </View> : null}


        </View>
    }

    short = (item) => {
        const {images, body} = item;
        let title2 = body;
        return <View>
            {strNotNull(body) ? <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                style={styles.body}>{title2}</Text> : null}


            {images && images.length > 0 ? this.shortImage(images) : null}


        </View>
    }

    previewImage = (images, index) => {
        let gallery = images.map(item => {
            return {url: item.url.replace('!sm', '')}
        })
        global.router.toImageGalleryPage(gallery, index)
    }

    shortImage = (images) => {
        if (images.length === 1) {
            return <View
                style={styles.long_cover}
            >
                <LeftAlignedImage
                    onPress={() => {
                        this.previewImage(images, 0)
                    }}
                    source={{uri: images[0].url}}/>
            </View>

        }

        let imageViews = images.map((item, key) => {
            return <TouchableOpacity
                key={'short' + key}
                onPress={() => {
                    this.previewImage(images, key)
                }}
            >
                <ImageLoad
                    style={styles.short_image}
                    source={{uri: item.url}}/>
            </TouchableOpacity>

        });

        return <View style={{
            flexWrap: 'wrap', flexDirection: 'row',
            alignItems: 'center', marginLeft: 8
        }}>
            {imageViews}
        </View>

    }
}