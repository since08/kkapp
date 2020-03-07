import React, {PureComponent, Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Platform
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import SearchBar from "../comm/SearchBar";
import {UltimateListView, ImageLoad} from '../../components'
import I18n from '../../I18n/I18n';
import {LoadErrorView, NoDataView} from '../../components/load';
import {hotels, info_types, getSaunas, getPermission} from '../../services/MacauDao';
import {getPosition, isEmptyObject, logMsg, strNotNull} from "../../utils/ComonHelper";
import RejectPage from "../comm/RejectPage";
import SunnaItem from './SunnaItem';
import {FoodItem} from './HotelSearch'
import {locations} from "../../services/SocialDao";
import {getApiType} from "../../services/RequestHelper";

export default class RecreationPage extends PureComponent {
    state = {
        search: false,
        show_content: true,
        reject_problem: '',
        name_index: 0,
        isMacau: false
    };

    componentDidMount() {
        getPosition(data => {
            const {longitude, latitude} = data;

            let body = {
                longitude: longitude,
                latitude: latitude,
                platform: Platform.OS === 'ios' ? 'ios' : 'android'
            };
            // let body = {
            //     latitude: "22.203672",
            //     longitude: "113.564241"
            // }

            this.sanna = body;
            getPermission(body, data => {
                logMsg("是否可访问", data);
                if (data.accessible) {
                    this.listView && this.listView.postRefresh([])
                    this.setState({
                        isMacau: true,
                        name_index: 1
                    })
                    setTimeout(() => {
                        this.refresh()
                    }, 200)
                }
            }, err => {
                console.log('获取定位失败1', err);
            })

            // locations(body, data => {
            //     let city_name = data.base.city_name
            //     // if (getApiType() === 'test')
            //     //     alert('定位城市：' + city_name)
            //     if (city_name && city_name.indexOf('澳门') !== -1) {
            //         this.listView && this.listView.postRefresh([])
            //         this.setState({
            //             isMacau: true,
            //             name_index: 1
            //         })
            //         setTimeout(() => {
            //             this.refresh()
            //         }, 200)
            //
            //
            //     }
            // }, err => {
            //     console.log("获取位置失败");
            // })
        }, err => {
            console.log('获取定位失败');
        })
    }

    refresh = () => {
        this.setState({
            reject_problem: ''
        });
        this.listView && this.listView.refresh();
    };

    change_content() {
        const {name_index, isMacau} = this.state;

        if (isMacau) {
            return (
                <View style={{
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}>
                    <TouchableOpacity onPress={() => {
                        this.listView && this.listView.postRefresh([])
                        this.setState({
                            name_index: 0
                        })
                        setTimeout(() => {
                            this.refresh()
                        }, 200)

                    }}
                                      style={styles.btns}>

                        <ImageBackground style={{
                            width: 82,
                            height: 28,
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                                         source={name_index === 1 ? Images.navigation2.show1 : Images.navigation2.show2}>
                            <Text
                                style={{
                                    marginBottom: 3,
                                    fontSize: name_index === 0 ? 16 : 14,
                                    color: 'white'
                                }}>休闲娱乐</Text>
                        </ImageBackground>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.listView && this.listView.postRefresh([])
                        this.setState({
                            name_index: 1
                        });
                        setTimeout(() => {
                            this.refresh()
                        }, 200)
                    }}
                                      style={styles.btns}>

                        <ImageBackground style={{
                            width: 82,
                            height: 28,
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                                         source={name_index === 0 ? Images.navigation2.show1 : Images.navigation2.show2}>
                            <Text
                                style={{
                                    marginBottom: 3,
                                    fontSize: name_index === 1 ? 16 : 14,
                                    color: 'white'
                                }}>桑拿水疗</Text>
                        </ImageBackground>

                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <Text style={[styles.title, {alignSelf: 'center'}]}>{'休闲娱乐'}</Text>
            )
        }

    }

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

                            }}/> : this.change_content()}
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
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

                        </TouchableOpacity>
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

                    }}/> : this.change_content()}
                <View style={{flex: 1}}/>
                <TouchableOpacity
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

                </TouchableOpacity>
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
        return <View style={{height: 5}}/>
    };


    item_view = (item, index) => {
        if (this.state.name_index === 1) {
            return <SunnaItem
                key={`${index}sanna`}
                item={item}/>
        } else if (this.state.name_index === 0) {
            return <FoodItem
                key={`recreation${index}`}
                item={item}
                refresh={() => {
                    this.listView.refresh()
                }}/>
        }
    };

    onFetch_forSunna = (page = 1, startFetch, abortFetch) => {
        if (isEmptyObject(this.sanna)) {
            abortFetch();
            return;
        }
        try {
            getSaunas(this.sanna, data => {
                console.log("Saunas", data);
                startFetch(data.items, 18)
            }, err => {
                console.log("Saunas_err", err)
                this.setState({
                    reject_problem: err.problem
                })
                abortFetch()
            });
        } catch (err) {
            console.log(err)
            abortFetch()
        }

    };

    onFetch_forEn = (page = 1, startFetch, abortFetch) => {
        const {type} = this.props.params.item;
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
    };

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            if (this.state.name_index === 1) {
                this.onFetch_forSunna(page, startFetch, abortFetch)
            } else if (this.state.name_index === 0) {
                this.onFetch_forEn(page, startFetch, abortFetch);
            }
        } catch (err) {
            console.log(err)
            abortFetch()
        }
    }
}

const styles = StyleSheet.create({
    btns: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
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