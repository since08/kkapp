import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList, ListView, TextInput} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from "../../I18n/I18n";
import CommentItem from './CommentItem';
import {NavigationBar, BaseComponent} from '../../components';
import UltimateFlatList from '../../components/ultimate';
import {getReplies, postRelaies} from '../../services/CommentDao';
import CommentBar from '../comm/CommentBar'
import {showToast} from '../../utils/ComonHelper'

export default class CommentInfoPage extends Component {

    constructor(props) {
        super(props)
        const {item} = props.params;
        this.target_type = 'comment';
        this.target_id = item.id;
    }

    state = {
        totalComment: 0
    };

    _separator = () => {
        return <View style={{height: 1, marginLeft: 68, marginRight: 17, backgroundColor: '#DDDDDD'}}/>;
    };


    render() {
        const {item} = this.props.params;

        return (
            <BaseComponent>
                <NavigationBar
                    barStyle={'dark-content'}
                    toolbarStyle={{backgroundColor: 'white'}}
                    leftBtnIcon={Images.mall_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 17, marginRight: 20}}
                    leftBtnPress={() => router.pop()}
                    titleStyle={{color: Colors._161817}}
                    title={I18n.t('comment_info')}/>

                <View style={{backgroundColor: '#FFFFFF', paddingBottom: 10, marginTop: 1}}>
                    <CommentItem
                        refreshList={this.refreshList}
                        repliesReFunc={() => {
                            this.target_type = 'comment';
                            this.target_id = item.id;
                            this.commentBar && this.commentBar.showInput()
                        }}
                        item={item}/>
                </View>

                <UltimateFlatList
                    header={() => {
                        return <Text style={styles.allComment}>{I18n.t('all_comment')}（{this.state.totalComment}）</Text>
                    }}
                    arrowImageStyle={{width: 20, height: 20, resizeMode: 'contain'}}
                    ref={ref => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `replies${index}`}
                    item={this.renderItem}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                    separator={this._separator}
                    pagination={false}
                />

                <View style={{height: 48}}/>

                <View style={{position: 'absolute', bottom: 0}}>
                    <CommentBar
                        onlyComment
                        placeholder={'写下回复'}
                        ref={ref => this.commentBar = ref}
                        send={comment => {
                            postRelaies({
                                    target_id: this.target_id,
                                    target_type: this.target_type,
                                    body: comment
                                },
                                data => {
                                    this.listView && this.listView.refresh()
                                    showToast(I18n.t('reply_success'));

                                }, err => {
                                })
                        }}

                    />
                </View>

            </BaseComponent>
        )
    }


    renderItem = (item, index) => {
        return (<CommentItem
            refreshList={() => {
                this.listView && this.listView.refresh()
            }
            }
            repliesReFunc={() => {
                this.target_type = 'reply';
                this.target_id = item.reply_id;
                this.commentBar && this.commentBar.showInput()
            }}
            item={item}/>)
    };

    onFetch = (page, postRefresh, endFetch) => {
        const {id} = this.props.params.item;
        let body = {comment_id: id};
        if (page === 1) {
            getReplies(body, data => {
                console.log("replies:", data);
                this.setState({
                    totalComment: data.replies_count
                });
                postRefresh(data.items, 9);
            }, err => {
                console.log('coming.....')
                endFetch()
            });

        }

    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginTop: 1,
    },
    allComment: {
        fontSize: 14,
        color: '#AAAAAA',
        marginLeft: 17,
        marginTop: 11,
        marginBottom: 10
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }

});