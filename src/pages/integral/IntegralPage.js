import React, {Component} from 'react';
import {
    ScrollView, Text, FlatList,
    StyleSheet,
    View, Image,
    TouchableOpacity, ImageBackground
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {postIntegralTask, postAward, getIntrgralCoupon} from '../../services/IntegralDao';
import {isEmptyObject} from "../../utils/ComonHelper";
import {getProfile} from "../../services/AccountDao";
import {ImageLoad} from '../../components'
import IntegralBar from './IntegralBar';

export default class IntegralPage extends Component {

    constructor(props) {
        super(props)


        this.action = "";
        this.background = "";
        this.unfinished = [];


        this.state = {
            unfinished: this.unfinished,
            finished: [],
            total_points: 0,
            coupons: []
        };
    }


    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        postIntegralTask({}, data => {
            this.setState({
                unfinished: data.items.unfinished,
                finished: data.items.finished
            })

        });

        getProfile('', data => {
            console.log(data)
            this.setState({
                total_points: data.total_points
            })

        }, err => {
        })

        getIntrgralCoupon({page_size: 3}, data => {
            console.log("积分商城三条数据：", data)
            this.setState({
                coupons: data.items
            })
        }, err => {

        })

    }


    render() {
        const {unfinished, finished, total_points, coupons} = this.state;

        return (
            <View style={ApplicationStyles.bgContainer}>
                <IntegralBar text={'我的积分'}/>


                <View style={styles.ruleView}>
                    <View style={{width: 50}}/>
                    <View style={{flex: 1}}/>
                    <Text
                        style={styles.ruleTxt1}>{total_points}</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        style={{marginRight: 17}}
                        onPress={() => {
                            global.router.toIntegralRulePage();
                        }}>
                        <Text style={styles.ruleTxt2}>！积分规则</Text>
                    </TouchableOpacity>

                </View>

                <ScrollView>

                    <View style={styles.mallView}>
                        <View style={[styles.mallLeft, {flexDirection: 'row', alignItems: 'center'}]}>
                            <Text style={{color: "#444444", fontSize: 18, fontWeight: 'bold'}}>积分商城</Text>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                              onPress={() => {
                                                  global.router.toIntegralMallPage(total_points);
                                              }}>
                                <Text style={{color: "#444444", fontSize: 12, marginRight: 3}}>更多</Text>
                                <Image style={{width: 8, height: 15}} source={Images.rightImg}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.mallLeft, styles.rowMillide, {marginTop: 29}]}>
                            {coupons.map((item, index) => {
                                return <TouchableOpacity key={index} style={[styles.mallBottomView]}
                                                         onPress={() => {
                                                             global.router.toIntegralInfoPage(item.id, total_points, this.refresh)
                                                         }}>
                                    <ImageLoad style={{height: 52, width: 83}} source={{uri: item.cover_link}}/>
                                    {/*<ImageBackground key={index} style={{*/}
                                    {/*height: 32,*/}
                                    {/*width: 83,*/}
                                    {/*flexDirection: 'row',*/}
                                    {/*alignItems: 'center'*/}
                                    {/*}}*/}
                                    {/*source={Images.integral.couponTop}>*/}
                                    {/*<Text style={{color: "#F34247", fontSize: 12, marginLeft: 7}}>¥<Text*/}
                                    {/*style={{fontSize: 20, fontWeight: 'bold'}}>{item.reduce_price}</Text></Text>*/}
                                    {/*<View style={{width: 120, flexDirection: 'column'}}>*/}
                                    {/*<Text style={{color: "#444444", fontSize: 7, marginLeft: 5}}>{item.name}</Text>*/}
                                    {/*<Text style={{*/}
                                    {/*color: "#444444",*/}
                                    {/*fontSize: 7,*/}
                                    {/*marginTop: 3*/}
                                    {/*}}>{item.short_desc}</Text>*/}
                                    {/*</View>*/}
                                    {/*</ImageBackground>*/}
                                    {/*<ImageLoad style={{height: 21,width: 83}} source={Images.integral.couponBootom}/>*/}
                                    <Text style={{
                                        color: "#444444",
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        marginTop: 11,
                                        width: 80
                                    }}>
                                        {item.name}</Text>
                                    {/*<Text style={{color: "#AAAAAA", fontSize: 12}}>可抵扣50元</Text>*/}
                                    <Text style={{color: "#E54A2E", fontSize: 12, marginTop: 9}}>{item.integrals}<Text
                                        style={{color: "#444444", fontSize: 12}}>积分</Text></Text>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View>

                    <View style={{backgroundColor: 'white', marginTop: 14}}>
                        {isEmptyObject(unfinished) ? null : <FlatList
                            ListHeaderComponent={this._header()}
                            data={unfinished}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={this._separator}
                            renderItem={item => this._renderItem(item, 'unfinished')}
                            keyExtractor={(item, index) => `integral${index}`}
                        />}
                        {this._separator()}
                        {isEmptyObject(finished) ? null : <FlatList
                            data={finished}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={this._separator}
                            renderItem={item => this._renderItem(item, 'finished')}
                            keyExtractor={(item, index) => `integral${index}`}
                        />}
                    </View>
                    <View style={{height: 50}}/>
                </ScrollView>

            </View>
        )
    }


    _header = (status) => {
        return (
            <View style={[styles.head, {
                marginRight: 17,
                marginLeft: 17,
                borderBottomWidth: 1.5,
                borderColor: '#F3F3F3'
            }]}>
                <Text style={{color: '#444444', fontSize: 18, marginLeft: 10, fontWeight: 'bold'}}>每日任务</Text>
            </View>
        )
    };

    _doingTime = (item) => {
        const {doing_times, option_type} = item;
        postAward({option_type: option_type}, data => {
            this.refresh()
        }, err => {

        })
    };

    _action = (item) => {
        let action = '';
        const {doing_times, done_times, total_doing_points, mark, limit_times} = item;
        if (done_times === limit_times) {
            action = '已完成'
        } else if (doing_times > 0 && done_times < limit_times) {
            action = "领取"
        } else if (doing_times === 0 && done_times < limit_times) {
            action = "去完成"
        }
        return action;

    };

    _background = (item) => {
        let action = this._action(item);
        if (action === '领取') {
            return '#6CC7FF'
        } else if (action === '去完成') {
            return '#FF6B4C'
        } else {
            return "#D9D9D9"
        }
    };

    toPage = (item) => {
        const {option_type} = item;
        if (option_type === 'topic') {
            router.popToTop();
        } else if (option_type === 'share') {
            global.router.toSettingPage()
        } else if (option_type === 'comment') {
            router.popToTop();
        } else if (option_type === 'friend_register') {
            global.router.toSettingPage()
        }

    };

    _renderItem = ({item, index}, type) => {
        if (isEmptyObject(item)) {
            return <View/>
        }
        const {doing_times, done_times, total_doing_points, mark, limit_times, total_done_points, point} = item;

        let unfinished = doing_times > 0 && total_doing_points > 0 ?
            <Text style={{
                color: '#AAAAAA',
                fontSize: 12
            }}>积分+{total_doing_points}</Text> : <Text style={{
                color: '#AAAAAA',
                fontSize: 12
            }}>积分+{point}</Text>;


        let finished = total_done_points > 0 ? <Text style={{
            color: '#AAAAAA',
            fontSize: 12
        }}>积分+{total_done_points}</Text> : null;


        let internal = type === 'finished' ? finished : unfinished;

        return (
            <View style={styles.item} key={type + index}>
                <ImageLoad style={{height: 34, width: 34}}
                           source={{uri: item.icon}}
                           emptyBg={Images.integral.tiezi}/>
                <View style={{marginLeft: 14, flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#444444', fontSize: 14}}>{mark}</Text>
                        {type === 'unfinished' ?
                            <Text style={{color: '#444444', fontSize: 14}}>{this._task(item, type)}</Text> : null}

                    </View>

                    {internal}

                </View>
                <View style={{flex: 1}}/>
                <TouchableOpacity
                    activeOpacity={this.action === "领取" ? 0 : 1}
                    style={[styles.statusView, {backgroundColor: this._background(item)}]}
                    onPress={() => {
                        if (this._action(item) === '去完成') {
                            this.toPage(item)
                        } else if (type === 'unfinished') {
                            this._doingTime(item)
                        }
                    }}>
                    <Text style={{color: '#FFFFFF', fontSize: 14}}>{this._action(item)}</Text>
                </TouchableOpacity>
            </View>
        )
    };

    _task = (item, type) => {
        const {limit_times, doing_times, done_times} = item;

        return type === 'unfinished' && done_times === limit_times ? '' : ` (${doing_times + done_times}/${limit_times})`
    }
    _separator = () => {
        return <View style={{backgroundColor: '#F3F3F3', height: 1.5, marginRight: 17, marginLeft: 17}}/>
    }

};
const styles = StyleSheet.create({
    rowMillide: {
        flexDirection: 'row'
    },
    mallBottomView: {
        flexDirection: 'column',
        width: '38%'
    },
    mallLeft: {
        marginLeft: 17, marginRight: 17
    },

    mallView: {
        backgroundColor: 'white',
        flexDirection: 'column',
        marginTop: 5,
        paddingTop: 17,
        paddingBottom: 15

    },
    nav: {
        height: Metrics.navBarHeight,
        width: '100%',
        backgroundColor: Colors._E54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Metrics.statusBarHeight
    },
    View1: {
        flexDirection: 'row',
        alignItems: 'center'
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
    btn_click: {
        marginRight: 17,
        color: '#FFFFFF', fontSize: 14
    },
    ruleView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors._E54,
        width: '100%',
        paddingTop: 14,
        paddingBottom: 18
    },
    ruleTxt1: {
        color: '#FFFFFF',
        fontSize: 30
    },
    ruleTxt2: {
        color: '#FFFFFF',
        fontSize: 12
    },
    head: {
        height: 47,
        flexDirection: 'row',
        alignItems: 'center'
    },
    item: {
        marginTop: 12,
        marginBottom: 13,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 17, marginLeft: 17
    },
    statusView: {
        width: 68, height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }


});