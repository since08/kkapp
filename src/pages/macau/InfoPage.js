/**
 * Created by lorne on 2018/5/13
 * Function:
 * Desc:
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, InteractionManager
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar, UltimateListView} from '../../components';
import RenderHtml from '../comm/RenderHtml';
import {getInfos} from '../../services/MacauDao'
import {
    isEmptyObject, isFollowed, shareHost, sharePage, showToast, strNotNull,
    uShareInfoItem
} from "../../utils/ComonHelper";
import LoadingView from "../../components/load/LoadingView";
import MusicPlayer from "./MusicPlayer";
import {topics_comments, topics_details, topics_like} from "../../services/SocialDao";
import {postComment, postRelaies} from "../../services/CommentDao";
import I18n from '../../I18n/I18n';
import CommentBar from '../comm/CommentBar';
import CommentList from "../comment/CommentList";
import {reallySize} from "../socials/Header";

export default class InfoPage extends PureComponent {
    state = {
        info: {},
        music: true,
        comments_count: 0,
        like_counts: 0
    }

    componentDidMount() {
        this.comment_id = '';
        InteractionManager.runAfterInteractions(() => {
            const {id} = this.props.params.info
            getInfos(id, data => {
                this.setState({
                    info: data.info,
                    like_counts: data.info.likes_count
                })
                if (strNotNull(data.info.audio_link))
                    this.musicShow && this.musicShow.downloadMusic(data.info.audio_link)
            }, err => {
            })
        })


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

    render() {
        const {info} = this.state;
        if (isEmptyObject(info)) {
            return (
                <View style={ApplicationStyles.bgContainer}>
                    <NavigationBar
                        title={title}
                        toolbarStyle={{
                            backgroundColor: Colors._E54
                        }}
                        leftBtnIcon={Images.sign_return}
                        leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        leftBtnPress={() => {
                            router.pop();
                            this.props.params.refresh && this.props.params.refresh()
                        }}
                    />
                </View>
            )
        }
        const {description, title, image, id, exist_coupon, audio_link, intro, total_views, total_likes, current_user_liked} = this.state.info;
        return <View style={ApplicationStyles.bgContainer}>
            <NavigationBar
                title={title}
                toolbarStyle={{
                    backgroundColor: Colors._E54
                }}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => {
                    router.pop();
                    this.props.params.refresh && this.props.params.refresh()
                }}
                // rightBtnIcon={Images.share2}
                // rightImageStyle={{height: 20, width: 19, marginLeft: 20, marginRight: 20}}
                // rightBtnPress={() => {
                //     uShareInfoItem(title, intro, image, id)
                // }}
            />

            {isEmptyObject(description) ? <LoadingView/> : <ScrollView style={{backgroundColor: 'white'}}>
                <View style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    paddingLeft: 17,
                    paddingRight: 17,
                    paddingBottom: 35
                }}>

                    <View style={{width: '100%'}}>
                        <Text style={{
                            fontSize: 17,
                            color: Colors.txt_444,
                            marginTop: 12,
                            marginBottom: 4,
                            fontWeight: 'bold'
                        }}>{title}</Text>

                    </View>


                    <RenderHtml
                        html={description}/>
                </View>

                <View style={[styles.btn_like, {
                    height: 44, width: Metrics.screenWidth - 34,
                    marginLeft: 17,
                    marginRight: 17
                }]}>
                    <Text style={styles.comment}>{`用户评论(${this.show_count(this.state.comments_count)})`}</Text>

                    <View style={{flex: 1}}/>

                    <Text style={styles.time}>阅读</Text>
                    <Text style={[styles.time, {
                        marginLeft: 4,
                        marginRight: 20
                    }]}>{total_views}</Text>
                    <View
                        style={styles.btn_like}>
                        <Image
                            style={styles.like}
                            source={current_user_liked ? Images.social.like_red : Images.social.like_gray}/>
                        <Text style={[styles.time, {marginLeft: 4}]}>{this.show_count(this.state.like_counts)}</Text>
                    </View>
                </View>
                <View style={{width: Metrics.screenWidth, height: 1.5, backgroundColor: '#F3F3F3'}}/>
                <UltimateListView
                    style={{marginBottom: 50}}
                    keyExtractor={(item, index) => index + "info"}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    item={this.itemView}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                />
            </ScrollView>}

            {strNotNull(audio_link) ? <TouchableOpacity style={{position: 'absolute', top: 80, right: 17}}
                                                        onPress={() => {
                                                            this.setState({
                                                                music: !this.state.music
                                                            })
                                                            this.musicShow && this.musicShow.pause()
                                                        }}>
                <Image style={{
                    width: Metrics.reallySize(26),
                    height: Metrics.reallySize(26)
                }}
                       source={this.state.music ? Images.macau.bg_music : Images.macau.bg_music_close}/>
            </TouchableOpacity> : null}
            <MusicPlayer ref={ref => this.musicShow = ref} music={this.state.music}/>

            {exist_coupon ? <TouchableOpacity style={{position: 'absolute', bottom: 20, right: 17}}
                                              onPress={() => {
                                                  if (isEmptyObject(global.login_user))
                                                      global.router.toLoginFirstPage()
                                                  else
                                                      global.router.toCouponReceivePage(id, this.refresh)

                                              }}>
                <Image style={{
                    width: Metrics.reallySize(54),
                    height: Metrics.reallySize(54)
                }}
                       source={Images.coupon.croup_receive}/>
            </TouchableOpacity> : null}

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
                                target_type: 'info',
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
                        uShareInfoItem(title, intro, image, id)
                    }}
                    like={() => {

                        topics_like({
                            target_id: id,
                            target_type: 'info',
                            current_user_liked
                        }, data => {
                            let info = {...this.state.info};
                            info.total_likes = data.total_likes;
                            info.current_user_liked = !current_user_liked;
                            this.setState({
                                info: info,
                                like_counts: data.total_likes
                            })

                        }, err => {
                            console.log(err)
                        })

                    }}
                />
            </View>

        </View>
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        const {id} = this.state.info;
        topics_comments({page, page_size: 20, target_id: id, target_type: 'info'}, data => {
            startFetch(data.items, 15)
            this.setState({
                comments_count: data.total_comments
            })
        }, err => {
            abortFetch()
        })
    };
    changed_commentId = (id) => {
        this.comment_id = id;
    };

    itemView = (item) => {
        return <CommentList item={item}
                            listView={this.listView}
                            commentBar={this.commentBar}
                            changed_commentId={this.changed_commentId}/>

    }

}

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
