import React, {PureComponent} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import {reallySize} from "./Header";
import {ImageLoad, NavigationBar, UltimateListView} from '../../components'
import I18n from '../../I18n/I18n';
import {Colors, Images, Metrics} from '../../Themes';
import Html from 'react-native-render-html';
import {
    topics_like, topics_details, topics_comments,
    follow, report_topic
} from "../../services/SocialDao";
import {
    getDateDiff, isEmptyObject, showToast, strNotNull,
    alertOrder, isFollowed, sharePage,shareHost
} from "../../utils/ComonHelper";
import CommentBar from '../comm/CommentBar';
import {postComment, postRelaies, delDeleteComment} from '../../services/CommentDao'
import PopAction from '../comm/PopAction';
import LoadingView from "../../components/load/LoadingView";
import CommentList from "../comment/CommentList";

const styles = StyleSheet.create({
    title: {
        fontSize: 17,
        color: Colors.txt_444,
        fontWeight: 'bold',
    },
    avatar: {
        height: 44,
        width: 44,
        borderRadius: 22
    },
    nick_name: {
        fontSize: 15,
        color: Colors._666
    },
    time: {
        fontSize: 12,
        color: Colors._AAA
    },
    focus: {
        fontSize: 14,
        color: Colors.txt_444,
    },
    btn_focus: {
        height: 26,
        width: 80,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: Colors.txt_444,
        alignItems: 'center',
        justifyContent: 'center'
    },
    info: {
        width: '100%',
        paddingLeft: 17,
        paddingRight: 17
    },
    btn_like: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    like: {
        height: reallySize(15),
        width: reallySize(15)
    },
    comment: {
        fontSize: 14,
        color: Colors._AAA
    },
    c_avatar: {
        height: 38,
        width: 38,
        borderRadius: 19
    },
    c_nick: {
        color: '#4A90E2',
        fontSize: 12
    },
    c_time: {
        color: Colors._CCC,
        fontSize: 10
    },
    c_comment: {
        height: 18,
        width: 20
    },
    c_content: {
        fontSize: 14,
        color: Colors.txt_444
    },
    c_tag: {
        paddingRight: 7,
        paddingLeft: 7,
        color: 'white',
        fontSize: 10,
        paddingTop: 2,
        paddingBottom: 2,
        marginLeft: 8,
        borderRadius: 2
    },
    c_reply: {
        height: 20,
        width: '100%'
    },
    c_body: {
        fontSize: 16,
        color: Colors.txt_444,
        marginLeft: 54,
        marginTop: 6
    },
    long_cover: {
        height: reallySize(200),
        width: '100%',
        marginTop: reallySize(10)
    },
    short_image: {
        height: 108,
        width: 108,
        marginTop: 9,
        marginLeft: 9
    },
    body: {
        color: Colors.txt_444,
        fontSize: 16,
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        letterSpacing: 1,
        lineHeight: 18
    }
})

const tagsStyles = {
    p: {
        marginTop: 1,
        marginBottom: 1,
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: 16,
        color: Colors.txt_444,
        letterSpacing: 1,
        lineHeight: 18
    },
    img:{
        alignSelf:'center'
    }
}

export default class LongArticle extends PureComponent {

    state = {
        comments_count: 0,
        article: {},
        followed: false
    }

    componentDidMount() {
        this.comment_id = '';
        const {article, isComment} = this.props.params;

        topics_details(article.id, data => {
            this.setState({
                followed: isFollowed(data.user.user_id)
            })
            this.setState({
                article: data
            })
        }, err => {
        });
        if (isComment) {
            setTimeout(() => {
                this.commentBar && this.commentBar.showInput()
            }, 500)

        }

    }

    render() {
        const {id, title, user, cover_link, current_user_liked, body, body_type} = this.state.article;

        if (isEmptyObject(this.state.article)) {
            return <LoadingView/>
        }

        return <View style={{flex: 1, backgroundColor: 'white'}}>
            <NavigationBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                toolbarStyle={{backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors._ECE}}
                title={I18n.t('social.detail')}
                titleStyle={{color: Colors._333}}
                leftBtnIcon={Images.ic_back}
                leftImageStyle={{height: 20, width: 10, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}
                rightBtnIcon={Images.social.more_3}
                rightImageStyle={{height: 4, width: 20, marginLeft: 20, marginRight: 20}}
                rightBtnPress={() => {
                    this.popAction && this.popAction.toggle();
                }}/>


            <UltimateListView
                style={{marginBottom: 50}}
                header={() => this.flatHeader()}
                keyExtractor={(item, index) => index + "longArticle"}
                ref={(ref) => this.listView = ref}
                onFetch={this.onFetch}
                item={this.itemView}
                refreshableTitlePull={I18n.t('pull_refresh')}
                refreshableTitleRelease={I18n.t('release_refresh')}
                dateTitle={I18n.t('last_refresh')}
                allLoadedText={I18n.t('no_more')}
                waitingSpinnerText={I18n.t('loading')}
            />

            <View style={{position: 'absolute', bottom: 0}}>
                <CommentBar
                    placeholder={strNotNull(this.comment_id) ?
                        I18n.t('reply') : I18n.t('write_comment')}
                    isLike={current_user_liked}
                    ref={ref => this.commentBar = ref}
                    count={this.state.comments_count}
                    send={comment => {

                        if (strNotNull(this.comment_id)) {

                            postRelaies({
                                    target_id: this.comment_id,
                                    target_type: 'comment',
                                    body: comment
                                },
                                data => {
                                    this.comment_id = '';
                                    showToast(I18n.t('reply_success'));
                                    this.listView && this.listView.refresh()
                                }, err => {
                                })


                        } else {
                            let body = {
                                target_type: 'topic',
                                target_id: id,
                                body: comment
                            };
                            postComment(body, data => {
                                showToast(I18n.t('comment_success'));
                                this.listView && this.listView.refresh()
                            }, err => {
                                showToast(err)
                            })
                        }

                    }}
                    share={() => {

                        sharePage(user.nick_name,
                            body_type === 'short' ? body : title, user.avatar, shareHost() + 'topics/' + id)
                    }}
                    like={() => {

                        topics_like({
                            target_id: id,
                            target_type: 'topic',
                            current_user_liked
                        }, data => {
                            let article = {...this.state.article};
                            article.total_likes = data.total_likes;
                            article.current_user_liked = !current_user_liked;
                            this.setState({
                                article
                            })

                        }, err => {
                            console.log(err)
                        })

                    }}
                />
            </View>

            <PopAction
                ref={ref => this.popAction = ref}
                btnArray={this.popActions()}/>


        </View>
    }

    //举报原因
    report = (index) => {
        const {id} = this.state.article;
        let reportList = global.reportList;
        let data = reportList[index];
        let body = {
            body: data.name,
            target_id: id,
            target_type: 'topic'
        };
        report_topic(body, (ret) => {
            showToast(I18n.t('report_success'));
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
    show_count = (item) => {
        if (strNotNull(item)) {
            if (item >= 1000 || item.length > 3) {
                return '999+'
            } else {
                return item
            }
        } else {
            return 0
        }
    }
    //长帖 个人信息
    flatHeader = () => {


        const {
            user, created_at, total_likes, comments, id, body_type,
            body, title, total_views, location, current_user_liked
        } = this.state.article;

        let des = body.trim().replace(/\n/g, "<br/>");
        let title2 = title.replace(/\n/g, '');

        const {address_title} = location;
        return <View>
            <View style={{backgroundColor: 'white'}}>
                <View style={styles.info}>
                    {strNotNull(title2) ? <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        marginTop: 10, marginBottom: 10
                    }}>
                        <Text
                            numberOfLines={2}
                            style={styles.title}>{title2}</Text>
                    </View> : <View style={{height: 15}}/>}


                    <View style={styles.btn_like}>
                        <TouchableOpacity
                            onPress={() => {
                                this.toUserPage(user)
                            }}>
                            <ImageLoad
                                emptyBg={Images.home_avatar}
                                style={styles.avatar}
                                source={{uri: user.avatar}}/>
                        </TouchableOpacity>


                        <View style={{marginLeft: 12}}>
                            <Text
                                onPress={() => {
                                    this.toUserPage(user)
                                }}
                                style={styles.nick_name}>{user.nick_name}</Text>
                            <Text
                                style={[styles.time, {marginTop: 5}]}
                            >{getDateDiff(created_at)}{strNotNull(address_title) ? `·${address_title}` : ""}</Text>
                        </View>

                        <View style={{flex: 1}}/>

                        {this.isMine(user.user_id) ? null : <TouchableOpacity
                            onPress={() => {
                                follow(this.state.followed, {target_id: user.user_id}, data => {
                                        this.setState({
                                            followed: !this.state.followed
                                        })
                                    },
                                    err => {
                                    }
                                )
                            }}
                            style={styles.btn_focus}>
                            <Text
                                style={styles.focus}>{this.state.followed ?
                                I18n.t('rank_focused') : I18n.t('rank_focus')}</Text>
                        </TouchableOpacity>
                        }


                    </View>

                </View>


                {body_type === 'long' ? <View style={{paddingLeft: 17, paddingRight: 17}}>
                    <Html
                        tagsStyles={tagsStyles}
                        imagesMaxWidth={Metrics.screenWidth - 34}
                        html={des}

                    />
                </View> : this.short(this.state.article)}


                <View style={[styles.btn_like, {
                    height: 44, width: Metrics.screenWidth - 34,
                    marginLeft: 17,
                    marginRight: 17
                }]}>
                    <Text style={styles.comment}>{`${I18n.t('social.comments')} (${this.show_count(this.state.comments_count)})`}</Text>

                    <View style={{flex: 1}}/>

                    <Text style={styles.time}>阅读</Text>
                    <Text style={[styles.time, {marginLeft: 4, marginRight: 20}]}>{total_views}</Text>
                    <View
                        style={styles.btn_like}>
                        <Image
                            style={styles.like}
                            source={current_user_liked ? Images.social.like_red : Images.social.like_gray}/>
                        <Text style={[styles.time, {marginLeft: 4}]}>{this.show_count(total_likes)}</Text>
                    </View>
                </View>

            </View>
            <View style={{height: 1, backgroundColor: Colors._ECE}}/>
        </View>
    }

    short = (item) => {
        const {images, body} = item;
        return <View>
            {strNotNull(body) ? <Text style={styles.body}>{body}</Text> : null}

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
            return <TouchableOpacity
                onPress={() => {
                    this.previewImage(images, 0)
                }}>
                <ImageLoad
                    style={styles.long_cover}
                    source={{uri: images[0].url}}/>
            </TouchableOpacity>

        }

        let imageViews = images.map((item, index) => {
            return <TouchableOpacity
                onPress={() => {
                    this.previewImage(images, index)
                }}
                key={'short' + index}>
                <ImageLoad
                    style={styles.short_image}
                    source={{uri: item.url}}/>
            </TouchableOpacity>

        });

        return <View style={{
            flexWrap: 'wrap', flexDirection: 'row',
            alignItems: 'center', marginTop: 14,
            marginLeft: 8
        }}>
            {imageViews}
        </View>

    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        const {id} = this.props.params.article;
        topics_comments({page, page_size: 20, target_id: id, target_type: 'topic'}, data => {
            startFetch(data.items, 15)
            this.setState({
                comments_count: data.total_comments
            })
        }, err => {
            abortFetch()
        })
    };


    isMine = (user_id) => {
        if (isEmptyObject(global.login_user)) {
            return false
        }

        return global.login_user.user_id === user_id
    }

    toUserPage = (user) => {
        if (!isEmptyObject(login_user) && user.user_id === login_user.user_id) {
            global.router.toPersonDynamic(user)
        } else {
            global.router.toUserTopicPage(user)
        }

    };

    changed_commentId=(id)=>{
        this.comment_id = id;
    };

    itemView = (item) => {
        return <CommentList item={item}
                            listView={this.listView}
                            commentBar={this.commentBar}
                            changed_commentId={this.changed_commentId}/>

    }
}