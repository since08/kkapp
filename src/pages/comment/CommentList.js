import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList, ListView, TextInput} from 'react-native';
import {alertOrder, getDateDiff, isEmptyObject} from "../../utils/ComonHelper";
import {Colors, Images} from "../../Themes";
import I18n from "../../I18n/I18n";
import {delDeleteComment} from "../../services/CommentDao";
import {ImageLoad} from '../../components'
import {reallySize} from "../socials/Header";

export default class CommentList extends Component {


    render() {
        const {item} = this.props;
        const {
            created_at, official,
            recommended, body, id, total_replies,
            user
        } = item;
        const {avatar, nick_name, user_id} = user;

        return <View style={{
            width: '100%', paddingLeft: 17, paddingRight: 17,
            paddingTop: 12
        }}>
            <View style={styles.btn_like}>
                <TouchableOpacity
                    onPress={() => this.toUserPage(user)}>
                    <ImageLoad
                        emptyBg={Images.home_avatar}
                        style={styles.c_avatar}
                        source={{uri: avatar}}/>
                </TouchableOpacity>


                <View style={{marginLeft: 10}}>
                    <View style={{flexDirection: 'row'}}>

                        <Text
                            onPress={() => this.toUserPage(user)}
                            style={styles.c_nick}>{nick_name}</Text>

                        {official ? <Text style={[styles.c_tag, {
                            backgroundColor: '#161718',
                            color: '#FFE9AD'
                        }]}>{I18n.t('social.official')}</Text> : null}

                        {recommended ? <Text style={[styles.c_tag, {
                            backgroundColor: '#161718',
                            color: '#FFE9AD'
                        }]}>{I18n.t('social.select')}</Text> : null}

                        {this.isMine(user_id) ? <Text
                            onPress={() => {
                                alertOrder(I18n.t('confirm_delete'), () => {
                                    delDeleteComment({comment_id: id}, data => {
                                        this.props.listView && this.props.listView.refresh()
                                    }, err => {

                                    })
                                })

                            }}
                            style={{color: Colors._CCC, marginLeft: 8, fontSize: 12}}>{I18n.t('delete')}</Text> : null}


                    </View>

                    <Text style={[styles.c_time, {marginTop: 5}]}>{getDateDiff(created_at)}</Text>
                </View>


                <View style={{flex: 1}}/>

                <TouchableOpacity
                    onPress={() => {
                        this.props.changed_commentId(id);
                        this.props.commentBar && this.props.commentBar.showInput()
                    }}>
                    <Image style={styles.c_comment}
                           source={Images.social.reply}/>
                </TouchableOpacity>


            </View>

            <Text
                onPress={() => {
                    this.props.changed_commentId(id);
                    this.props.commentBar && this.props.commentBar.showInput()
                }}
                style={styles.c_body}>{body}</Text>

            {total_replies > 0 ? <TouchableOpacity
                onPress={() => {
                    global.router.toCommentInfoPage(item);
                }}
                style={{
                    height: 20,
                    backgroundColor: '#ECECEE',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 54,
                    marginTop: 8
                }}>
                <Text
                    style={[styles.c_nick, {marginLeft: 6}]}>{`${I18n.t('look_detail')}${total_replies}${I18n.t('social.replay')}`}</Text>


            </TouchableOpacity> : null}


            <View style={{height: 1, backgroundColor: Colors._ECE, marginTop: 8}}/>


        </View>

    }

    toUserPage = (user) => {
        if (!isEmptyObject(login_user) && user.user_id === login_user.user_id) {
            global.router.toPersonDynamic(user)
        } else {
            global.router.toUserTopicPage(user)
        }

    };

    isMine = (user_id) => {
        if (isEmptyObject(global.login_user)) {
            return false
        }

        return global.login_user.user_id === user_id
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
        lineHeight:18
    }
})
