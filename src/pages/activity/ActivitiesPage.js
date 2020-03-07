import React, {Component} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, Modal
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {getActivities} from "../../services/AccountDao";
import I18n from "../../I18n/I18n";
import {ImageLoad, UltimateListView} from "../../components";
import {LoadErrorView, NoDataView} from '../../components/load';
import {isEmptyObject} from "../../utils/ComonHelper";
import AnimatedTurnTableDrawPage from '../lottery/AnimatedTurnTableDrawPage'

export default class ActivitiesPage extends Component {

    state = {
        lottery: false
    }

    refresh = () => {
        this.listView && this.listView.refresh();
    }

    item_view = (item, index) => {
        const {status, banner, is_wheel} = item;
        return (
            <TouchableOpacity onPress={() => {
                if (isEmptyObject(global.login_user)) {
                    global.router.toLoginFirstPage()
                } else {
                    if (is_wheel) {
                        this.popAnimated && this.popAnimated.toggle2();
                    } else {
                        global.router.toActivityInfo(this.props, item);
                    }
                }

            }}>
                <ImageBackground source={{uri: banner}} style={{height: 156, width: '100%'}}>
                    {/*<ImageBackground source={this.backgroundImg(status)}*/}
                    {/*style={{*/}
                    {/*width: 45, height: 16, alignItems: 'center', justifyContent: 'center',*/}
                    {/*backgroundColor: this.backgroundImg(status)*/}
                    {/*}}>*/}
                    {/*<Text style={{fontSize: 14, color: '#FFFFFF'}}>{this.active_type(status)}</Text>*/}
                    {/*</ImageBackground>*/}
                </ImageBackground>
            </TouchableOpacity>
        )
    };


    backgroundImg = (type) => {
        if (type === 'doing') {
            return 'rgba(0,0,0,0.4796)'
        } else if (type === 'no_start') {
            return 'rgba(0,0,0,0.4796)'
        } else if (type === 'finished') {
            return 'rgba(177, 177, 177,1)'
        }
    };

    active_type = (type) => {
        if (type === 'doing') {
            return '进行中'
        } else if (type === 'no_start') {
            return '即将开始'
        } else if (type === 'finished') {
            return '已结束'
        }

    };

    render() {
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    barStyle={'dark-content'}
                    toolbarStyle={{backgroundColor: 'white'}}
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    title="活动"
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => {
                        router.pop();
                    }}
                    rightBtnText={"我的奖品"}
                    btnTextStyle={{
                        fontSize: 14, color: '#444444', marginRight: 17
                    }}
                    rightBtnPress={() => {
                        if (isEmptyObject(global.login_user)) {
                            global.router.toLoginFirstPage()
                        } else {
                            global.router.toMyWardsPage()
                        }

                    }}
                />
                <UltimateListView
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
                        return this.state.error ? <LoadErrorView
                            onPress={() => {
                                this.listView.refresh()
                            }}/> : <NoDataView/>;
                    }}
                />

                <AnimatedTurnTableDrawPage pop={false} ref={ref => this.popAnimated = ref}/>
            </View>
        )
    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            getActivities({page: 1, page_size: 20}, data => {
                console.log("activities", data.items);
                startFetch(data.items, 18)
            }, err => {
                console.log("Activities_err", err)
                abortFetch()
            })

        } catch (err) {
            console.log(err)
            abortFetch()
        }
    }

    separator = () => {
        return <View style={{height: 5}}/>
    }
}