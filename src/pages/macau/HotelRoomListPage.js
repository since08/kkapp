import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ImageBackground, Modal
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {convertDate, isEmptyObject, logMsg, strNotNull} from "../../utils/ComonHelper";
import {getRoomList, hotels} from "../../services/MacauDao";
import TimeSpecificationInfo from './TimeSpecificationInfo';
import SearchBar from './SearchBar';
import I18n from '../../I18n/I18n';
import {ImageLoad, UltimateListView} from "../../components";
import {LoadErrorView, NoDataView} from '../../components/load';

export default class HotelRoomListPage extends PureComponent {

    state = {
        timeShow: false,
        last_change_time: this.props.params.date,
        click_index: false,
        room_list: []
    };

    componentDidMount() {

    }

    showSpecInfo = () => {
        this.setState({
            timeShow: !this.state.timeShow
        })
    };

    _change = (date) => {
        this.setState({
            last_change_time: date
        });
        this.listView && this.listView.refresh();
        console.log("最后选择的时间：", this.state.last_change_time)
    };

    refresh = () => {
        this.listView && this.listView.refresh();
    };

    render() {
        const {hotel, date} = this.props.params;
        const {timeShow, last_change_time} = this.state;
        return (<View style={ApplicationStyles.bgContainer}>
                <SearchBar
                    showSpecInfo={this.showSpecInfo}
                    changeTime={last_change_time}
                    _click={hotel.title}/>

                <UltimateListView
                    style={{paddingTop: 6}}
                    ListHeaderComponent={this._separator}
                    separator={this._separator}
                    keyExtractor={(item, index) => index + "item"}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    item={this._renderItem}
                    refreshableTitlePull={I18n.t('pull_refresh')}
                    refreshableTitleRelease={I18n.t('release_refresh')}
                    dateTitle={I18n.t('last_refresh')}
                    allLoadedText={I18n.t('no_more')}
                    waitingSpinnerText={I18n.t('loading')}
                    emptyView={() => <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 18, color: "#888888"}}>该酒店暂无空余房间</Text>
                    </View>}
                />

                {timeShow ? <TimeSpecificationInfo
                    showSpecInfo={this.showSpecInfo}
                    _change={this._change}/> : null}
            </View>
        )
    };

    onFetch = (page = 1, startFetch, abortFetch) => {
        try {
            const {hotel, date} = this.props.params;
            getRoomList({
                page,
                page_size: 20,
                begin_date: this.state.last_change_time.begin_date,
                id: hotel.id
            }, data => {
                let lists = data.items;
                lists.map((item) => {
                    item.isSelect = false;
                });
                this.setState({
                    room_list: lists
                })
                console.log("RoomList:", data)
                startFetch(lists, 18)
            }, err => {
                abortFetch()
            })
        } catch (err) {
            console.log(err)
            abortFetch()
        }
    };


    _discount = (price, discount_amount) => {
        if (strNotNull(discount_amount)) {
            if (Number.parseFloat(discount_amount) > Number.parseFloat(price)) {
                return price;
            } else {
                return Number.parseFloat(price) - Number.parseFloat(discount_amount)
            }
        } else {
            return price
        }
    };

    lowest_price = (prices) => {
        let lowst = this._discount(prices[0].price, prices[0].discount_amount);
        prices.forEach((item) => {
            if (Number.parseFloat(this._discount(item.price, item.discount_amount)) < Number.parseFloat(lowst)) {
                lowst = item.price
            }
        });
        return lowst;
    };

    _renderItem = (item, index) => {
        const {room_list} = this.state;
        const {id, images, notes, prices, tags, title, discount_amount} = item;
        return (
            <View style={styles.itemView}>
                <View style={styles.itemView2}>
                    <ImageMessage images={images}/>
                    <Message item={item}/>

                    <TouchableOpacity style={styles.priceView} onPress={() => {
                        room_list.forEach((x) => {
                            if (x.id === item.id) {
                                x.isSelect = !x.isSelect
                            }
                        })
                        this.setState({
                            room_list: [...room_list]
                        })
                    }}
                                      activeOpacity={1}>
                        <Text style={{color: "#FF3F3F", fontSize: 20}}><Text
                            style={{color: "#FF3F3F", fontSize: 12}}>¥</Text>{this.lowest_price(prices)}
                            <Text style={{fontSize: 12}}>起</Text></Text>


                        <Image style={{width: 16, height: 8, marginTop: 6}}
                               source={item.isSelect ? Images.macau.bth : Images.macau.top}/>

                    </TouchableOpacity>
                </View>

                <View style={{height: 20}}/>

                {item.isSelect ? <FlatList
                    data={prices}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: 'white'}}/>}
                    renderItem={price_item => this.items(price_item, item)}
                    keyExtractor={(item, index) => `items${index}`}/> : null}
            </View>

        )
    };

    items = (price_item, item) => {
        console.log("price_item", price_item)
        console.log("item", item)
        const {id, images, notes, prices, tags, title} = item;
        const {discount_amount, price, room_price_id, saleable_num} = price_item.item;

        return (
            <View style={[styles.itemView2, {
                backgroundColor: '#F3F3F3',
                width: Metrics.screenWidth - 30,
                marginTop: 1,
                paddingTop: 14,
                alignSelf: 'center',
                alignItems: 'flex-start'
            }]}>
                <Message item={item} select={true} price_item={price_item.item}/>
                <View style={[styles.priceView, {paddingTop: 0, marginTop: 0, alignItems: 'flex-end'}]}>
                    <Text style={{color: "#FF3F3F", fontSize: 20}}><Text
                        style={{color: "#FF3F3F", fontSize: 12}}>¥</Text>{this._discount(price, discount_amount)}</Text>


                    <View style={{flexDirection: 'row', alignItems: "center"}}>
                        <Text style={{color: "#AAAAAA", fontSize: 12, marginRight: 4}}>原价</Text>
                        <Text
                            style={{color: "#AAAAAA", fontSize: 12, textDecorationLine: 'line-through'}}>¥{price}</Text>
                    </View>

                    <TouchableOpacity
                        style={[saleable_num <= 0 ? styles.reservation2 : styles.reservation, {backgroundColor: saleable_num <= 0 ? '#F3F3F3' : '#FF6448'}]}
                        onPress={() => {
                            if (saleable_num > 0) {
                                if (isEmptyObject(global.login_user)) {
                                    router.toLoginFirstPage()
                                } else
                                    router.toRoomReservationPage(item, price_item.item, this.state.last_change_time, this.refresh)
                            }
                        }}>
                        <Text style={{
                            color: saleable_num <= 0 ? '#888888' : "#FFFFFF",
                            fontSize: 14
                        }}>{saleable_num <= 0 ? '售罄' : '预定'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    };

    _separator = () => {
        return (
            <View style={{width: '100%', height: 5, backgroundColor: '#ECECEE'}}/>
        )
    }


}

export class ImageMessage extends PureComponent {

    previewImage = (images) => {
        let gallery = images.map(item => {
            return {url: item.replace('!sm', '')}
        })
        global.router.toImageGalleryPage(gallery, 0)
    };

    render() {
        const {images} = this.props;

        return (
            <TouchableOpacity
                onPress={() => {
                    this.previewImage(images)
                }}
            >
                <ImageBackground
                    emptyBg={Images.default_img}
                    style={{
                        width: 68,
                        height: 68,
                        marginLeft: 12,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}
                    source={isEmptyObject(images) ? Images.empty_image : {uri: images[0]}}>
                    <View style={styles.counts}>
                        <Text style={{color: '#FFFFFF', fontSize: 9}}>{images.length}张</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        )
    }
}

export class Message extends PureComponent {

    _breakfast = (notes) => {
        return (
            <View style={{flexDirection: 'row', marginTop: 6}}>
                {notes.map((note, index) => {
                    return <Text key={index} style={[styles.txt2, {marginRight: 10}]}>{note}</Text>
                })}
            </View>
        )
    };
    _message = (tags) => {
        return (
            <View style={styles.message}>
                {tags.map((tag, index) => {
                    return <View key={index} style={[styles.message1, {
                        marginRight: 6,
                        alignItems: this.props.select && this.props.select === true ? 'flex-start' : 'center',
                        paddingLeft: this.props.select && this.props.select === true ? 0 : 5
                    }]}>
                        <Text style={styles.txt}>{tag}</Text>
                    </View>
                })}

            </View>
        )
    };
    _prices = (price_item) => {
        if(price_item.is_official){
            return (
                <Text style={{color:"#AAAAAA",fontSize:12,marginTop:4}}>官方挂售</Text>
            )
        }else{
            return (
                <Text style={{color:"#AAAAAA",fontSize:12,marginTop:4}}>代理挂售</Text>
            )
        }

    };

    render() {
        const {item,price_item,select} = this.props;
        const {notes, title, tags} = item;
        return (
            <View style={styles.messageView}>
                <Text style={{color: "#161718", fontSize: 18, fontWeight: 'bold'}}>{title}</Text>
                {!isEmptyObject(item.tags) ? this._message(tags) :
                    <Text style={{color: '#CCCCCC', fontSize: 12, marginTop: 6}}>暂无房型信息</Text>}

                {!isEmptyObject(notes) ? this._breakfast(notes) : null}

                {select && !isEmptyObject(price_item) ? this._prices(price_item) : null}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    itemView: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF"
    },
    itemView2: {
        flexDirection: 'row',
    },
    messageView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 17
    },
    message: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8
    },
    message1: {
        backgroundColor: '#F3F3F3',
        paddingTop: 3,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2
    },
    txt: {
        color: '#888888',
        fontSize: 10
    },
    txt2: {
        color: "#4A90E2",
        fontSize: 12
    },
    priceView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 17,
        // justifyContent: 'space-between',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: '#F3F3F3'
    },
    reservation: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#FF6448',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 3,
        shadowOffset: {width: 1, height: 1},
        shadowColor: "#FF4726"
    },
    reservation2: {
        paddingTop: 0,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 0,
        backgroundColor: '#FF6448',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 3,
        shadowOffset: {width: 1, height: 1},
        shadowColor: "#FF4726"
    },
    counts: {
        width: 22,
        height: 11,
        backgroundColor: "#000000",
        borderRadius: 2,
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
        marginBottom: 1
    }
})

