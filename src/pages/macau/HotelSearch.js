import React, {PureComponent, Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import SearchBar from "../comm/SearchBar";
import {UltimateListView, ImageLoad} from '../../components'
import I18n from '../../I18n/I18n';
import {LoadErrorView, NoDataView} from '../../components/load';
import {hotels, info_types, exchange_rates} from '../../services/MacauDao';
import {isEmptyObject, logMsg, strNotNull} from "../../utils/ComonHelper";
import {reallySize} from "../socials/Header";
import RejectPage from "../comm/RejectPage";

const styles = StyleSheet.create({
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
    img_search: {
        height: 17,
        width: 17
    },
    btn_search: {
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default class HotelSearch extends PureComponent {
    state = {
        search: false,
        show_content: true,
        reject_problem: ''
    };

    refresh = () => {
        this.setState({
            reject_problem: ''
        });
        this.listView && this.listView.refresh();
    };


    render() {
        const {name, type} = this.props.params.item;
        if (this.state.reject_problem === 'NETWORK_ERROR') {
            return (
                <View style={ApplicationStyles.bgContainer}>
                    <View style={styles.nav}>
                        <TouchableOpacity
                            style={styles.btn_search}
                            onPress={() => {
                                router.pop()
                            }}>

                            <Image
                                style={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                                source={Images.sign_return}/>

                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        {this.state.search ? <SearchBar
                            keyword={keyword => {
                                this.keyword = keyword;
                                this.listView && this.listView.refresh()

                            }}/> : <Text style={styles.title}>{name}</Text>}
                        <View style={{flex: 1}}/>


                        {type === 'exchange_rate' ? <View style={{width: 40}}/> : <TouchableOpacity
                            style={styles.btn_search}
                            onPress={() => {
                                this.setState({
                                    search: !this.state.search
                                })
                                this.keyword = undefined;
                                this.listView && this.listView.refresh()
                            }}>
                            {this.state.search ? <Text style={styles.cancel}>取消</Text> : <Image
                                style={styles.img_search}
                                source={Images.macau.search}/>}

                        </TouchableOpacity>}

                    </View>

                    <RejectPage refresh={this.refresh}/>
                </View>
            )
        }
        return <View style={ApplicationStyles.bgContainer}>
            <View style={styles.nav}>
                <TouchableOpacity
                    style={styles.btn_search}
                    onPress={() => {
                        router.pop()
                    }}>

                    <Image
                        style={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                        source={Images.sign_return}/>

                </TouchableOpacity>
                <View style={{flex: 1}}/>
                {this.state.search ? <SearchBar
                    keyword={keyword => {
                        this.keyword = keyword;
                        this.listView && this.listView.refresh()

                    }}/> : <Text style={styles.title}>{name}</Text>}
                <View style={{flex: 1}}/>


                {type === 'exchange_rate' ? <View style={{width: 40}}/> : <TouchableOpacity
                    style={styles.btn_search}
                    onPress={() => {
                        this.setState({
                            search: !this.state.search
                        })
                        this.keyword = undefined;
                        this.listView && this.listView.refresh()
                    }}>
                    {this.state.search ? <Text style={styles.cancel}>取消</Text> : <Image
                        style={styles.img_search}
                        source={Images.macau.search}/>}

                </TouchableOpacity>}


            </View>
            {this.separator()}

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

        </View>
    }

    separator = () => {
        const {name, type} = this.props.params.item;
        if (type !== 'exchange_rate')
            return <View style={{height: 5}}/>
        else
            return null
    }

    item_view = (item, index, separators) => {
        const {type} = this.props.params.item;
        if (type === 'hotel')
            return <HotelItem
                key={`${type}${index}`}
                item={item}/>
        else if (type === 'exchange_rate')
            return <RateItem
                refresh={() => {
                    this.listView.refresh()
                }}
                key={`${type}${index}`}
                item={item}/>
        else
            return <FoodItem
                key={`${type}${index}`}
                item={item}
                refresh={() => {
                    this.listView.refresh()
                }}/>

    }

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            const {type} = this.props.params.item;
            if (type === 'hotel') {
                hotels({page, page_size: 20, keyword: this.keyword}, data => {
                    startFetch(data.items, 18)
                }, err => {
                    logMsg("reject:", err)
                    this.setState({
                        reject_problem: err.problem
                    })
                    abortFetch()
                })
            } else if (type === 'exchange_rate') {
                exchange_rates(data => {
                    startFetch(data.items, 18)
                }, err => {
                    logMsg("reject:", err)
                    this.setState({
                        reject_problem: err.problem
                    })
                    abortFetch()
                })

            } else {
                info_types({
                        page, page_size: 20, keyword: this.keyword, type
                    },
                    data => {
                        startFetch(data.items, 18)
                    }, err => {
                        logMsg("reject:", err)
                        this.setState({
                            reject_problem: err.problem
                        })
                        abortFetch()
                    }
                )

            }


        } catch (err) {
            console.log(err)
            abortFetch()
        }
    }


}


class HotelItem extends Component {

    render() {
        const {title, address, location, logo} = this.props.item;
        return <TouchableOpacity
            onPress={() => {
                router.toHotelDetail(this.props.item)
            }}
            style={{
                height: 128,
                backgroundColor: Colors.white,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center'
            }}>

            <ImageLoad
                source={{uri: logo}}
                style={{height: 95, width: 67, marginLeft: 12, marginRight: 12}}/>

            <View style={{marginRight: 17, height: 95, flex: 1}}>
                <Text
                    numberOfLines={2}
                    style={{fontSize: 17, color: Colors._161817, marginTop: 5}}>{title}</Text>
                <Text
                    numberOfLines={2}
                    style={{fontSize: 14, color: Colors._999, marginTop: 5}}>{location}</Text>

                <View style={{flex: 1}}/>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 10, height: 14}}
                           source={Images.macau.location}/>

                    <Text
                        numberOfLines={1}
                        style={{fontSize: 12, color: '#4A90E2', marginLeft: 7}}>{}</Text>

                </View>

            </View>


        </TouchableOpacity>
    }
}

export class FoodItem extends PureComponent {

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
        const {title, read, like, image, date, total_views, likes_count, comments_count} = this.props.item;
        return <TouchableOpacity
            onPress={() => {
                router.toInfoPage(this.props.item, this.props.refresh)
            }}
            style={{
                height: 102, backgroundColor: Colors.white, width: '100%',
                alignItems: 'center', flexDirection: 'row',
                paddingLeft: 17, paddingRight: 17
            }}>
            <View style={{flex: 1, height: 74}}>
                <Text
                    numberOfLines={2}
                    style={{fontSize: 16, color: Colors.txt_444, marginTop: 5}}>{title}</Text>
                <View style={{flex: 1}}/>

                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text
                        numberOfLines={1}
                        style={{fontSize: 12, color: Colors._AAA}}>{date}</Text>

                    <View style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'flex-start',
                        marginTop: 10,
                        marginBottom: 10,
                        marginRight: 17
                    }}>


                        <View
                            style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 12, color: Colors._AAA}}>阅读</Text>
                            <Text style={{
                                fontSize: 12,
                                color: Colors._AAA,
                                marginLeft: 2,
                                marginRight: 8
                            }}>{total_views}</Text>

                            <Image
                                style={{height: reallySize(12), width: reallySize(12)}}
                                source={Images.social.like_gray}/>
                            <Text style={{
                                fontSize: 12,
                                color: Colors._AAA,
                                marginRight: 8,
                                marginLeft: 2
                            }}>{this.show_count(likes_count)}</Text>

                            {/*<Image*/}
                            {/*style={{height: reallySize(12), width: reallySize(12)}}*/}
                            {/*source={Images.social.reply}/>*/}
                            {/*<Text style={{*/}
                            {/*fontSize: 12,*/}
                            {/*color: Colors._AAA,*/}
                            {/*marginLeft: 2*/}
                            {/*}}>{this.show_count(comments_count)}</Text>*/}
                        </View>
                    </View>

                </View>

            </View>

            <Image
                source={{uri: image}}
                style={{width: 122, height: 74, marginLeft: 16}}/>

        </TouchableOpacity>
    }
}

class RoomItem extends PureComponent {
    render() {
        return <TouchableOpacity
            style={{
                height: 128, width: '100%', backgroundColor: 'white',
                flexDirection: 'row', alignItems: 'center'
            }}>

            <ImageLoad

                style={{height: 95, width: 67}}/>


        </TouchableOpacity>
    }
}

class RateItem extends PureComponent {
    render() {

        const {rate, rate_type, s_currency, t_currency} = this.props.item;
        let t_rate = 1 / Number.parseFloat(rate);
        t_rate = t_rate.toFixed(4);
        let rate_type_name = rate_type === 'real_time' ? '实时汇率' : '本地汇率';
        let rate_bg = rate_type === 'real_time' ? Images.macau.rate1 : Images.macau.rate2;
        let target_source = `1${t_currency}=${t_rate}${s_currency}`;
        let source_target = `1${s_currency}=${rate}${t_currency}`;
        let login_or_local = !isEmptyObject(global.login_user) || rate_type === 'real_time';
        if (rate_type === 'local' && isEmptyObject(global.login_user)) {
            target_source = '登录查看'
        }

        return <TouchableOpacity
            onPress={() => {
                if (rate_type === 'local' && isEmptyObject(global.login_user)) {
                    router.toLoginFirstPage()
                }

            }}
            activeOpacity={1}
            style={{
                height: 142, width: '100%', alignItems: 'center',
                justifyContent: 'center'
            }}>


            <Image
                source={rate_bg}
                style={{height: 142, width: '100%', position: 'absolute'}}/>
            <Text style={{fontSize: 15, color: 'white'}}>{rate_type_name}</Text>

            <Text style={{fontSize: 20, color: 'white', marginTop: 10}}>{target_source}</Text>
            {login_or_local ? <Text style={{fontSize: 20, color: 'white', marginTop: 6}}>{source_target}</Text> : null}


        </TouchableOpacity>
    }
}