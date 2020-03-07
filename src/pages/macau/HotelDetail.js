import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, Platform, Linking
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import Swiper from 'react-native-swiper';
import {hotelDetail} from '../../services/MacauDao';
import RenderHtml from '../comm/RenderHtml';
import {NavigationBar} from '../../components'
import {call, strNotNull, turn2MapMark} from '../../utils/ComonHelper';
import * as Animatable from 'react-native-animatable';
import PopAction from '../comm/PopAction';
import I18n from '../../I18n/I18n';

const list = [{id: 0, name: '高德地图', type: 'gaode'}, {id: 1, name: '苹果地图', type: 'pingguo'}];

const styles = StyleSheet.create({
    banner: {
        height: 200,
        width: '100%',
        backgroundColor: Colors._ECE
    },
    activeDot: {
        backgroundColor: 'white',
        width: 18,
        height: 4,
        borderRadius: 2,
        marginBottom: 0
    },
    dot: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 9,
        height: 4,
        borderRadius: 2,
        marginBottom: 0
    },
    nav_view: {
        paddingTop: 10,
        paddingBottom: 14,
        backgroundColor: Colors.white,
        marginBottom: 5,
        flexDirection: 'row',
        // alignItems:'center',
        paddingLeft: 18,
        width: Metrics.screenWidth
    },
    title: {
        fontSize: 18,
        color: Colors.txt_444,
        width: '70%'
    },
    location: {
        fontSize: 12,
        color: Colors._AAA,
        width: '70%'
    },
    btn_book: {
        height: 60,
        width: Metrics.screenWidth,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: '#F3F3F3'
    },
    btn_book_txt: {
        fontSize: 18,
        color: Colors.white
    },
    stars: {
        width: 14,
        height: 14,
        marginRight: 4
    },
    starView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 9
    },
    location2: {
        color: '#999999',
        fontSize: 12,
        marginTop: 8
    },
    price3: {
        color: '#FF3F3F',
        fontSize: 20
    },
    page2: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
    },
    View_page: {
        height: 60,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F3F3F3',
        borderRadius: 2
    },
    text_1: {
        color: "#E54A2E",
        fontSize: 14
    }
})

export default class HotelDetail extends PureComponent {

    state = {
        hotel: {},
        opacity: 0,
        targetAppName: 'gaode',
        showSelect: false
    }

    componentWillMount() {
        const {hotel, date} = this.props.params;
        let body = {id: hotel.id, date: date.begin_date};
        hotelDetail(body, data => {
            console.log("hotel:", data)
            this.setState({
                hotel: data.hotel
            })
        }, err => {

        })
    };

    _star = (star) => {
        let stars = [];
        for (let i = 1; i <= star; i++) {
            stars.push(i);
        }
        return stars;
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

    render() {
        const {hotel} = this.props.params;
        const {images, location, title, description, telephone, amap_poiid, star_level, amap_navigation_url, amap_location, start_price, discount_amount} = this.state.hotel;
        return <View style={ApplicationStyles.bgContainer}>


            <ScrollView
                iosalwaysBounceVertical={false}
                scrollEventThrottle={16}
                onScroll={this._onScroll}>
                <Banner banners={images}/>

                <View style={styles.nav_view}>

                    <View style={{width: '70%'}}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                            <Text style={{color: '#999999', fontSize: 12}}>酒店星级：</Text>
                            {this._star(star_level).map((index) => {
                                return <Image key={index} style={styles.stars} source={Images.macau.star}/>
                            })}
                        </View>
                        <Text selectable={true} style={styles.location2} numberOfLines={2}>地址：{location}</Text>
                    </View>
                    <View style={{flex: 1}}/>

                    <View style={{marginRight: 22, flexDirection: 'column', alignItems: 'flex-end'}}>
                        {start_price !== '0.0' ? <Text style={styles.price3}><Text
                            style={{
                                color: '#FF3F3F',
                                fontSize: 12
                            }}>¥</Text>{this._discount(start_price, discount_amount)}<Text
                            style={{color: '#AAAAAA', fontSize: 12}}>起</Text></Text> : null}
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={{flexDirection: 'row'}}
                                          onPress={() => {
                                              if (Platform.OS === 'ios') {
                                                  this.popAction && this.popAction.toggle();
                                              } else {
                                                  if (strNotNull(amap_navigation_url))
                                                      turn2MapMark(amap_location, amap_navigation_url, amap_poiid, location, title, '')

                                              }
                                          }}>
                            <Image style={{height: 14, width: 10}}
                                   source={Images.macau.location}/>
                            <Text style={{color: "#4A90E2", fontSize: 12, marginLeft: 4}}>地图</Text>
                        </TouchableOpacity>

                    </View>


                    {/*<View style={{flex:1}}/>*/}

                    {/*<TouchableOpacity*/}
                    {/*style={{marginRight: 17}}*/}
                    {/*onPress={() => {*/}
                    {/*call(telephone)*/}
                    {/*}}>*/}
                    {/*<Image style={{height: 20, width: 20, marginLeft: 20, marginRight: 20}}*/}
                    {/*source={Images.macau.viewpoint}/>*/}
                    {/*</TouchableOpacity>*/}
                </View>

                <View style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    paddingLeft: 17,
                    paddingRight: 17,
                    paddingBottom: 70
                }}>
                    <RenderHtml
                        html={description}/>
                </View>


            </ScrollView>

            <NavigationBar
                toolbarStyle={{
                    position: 'absolute',
                    top: 0,
                    backgroundColor: 'rgba(229,74,46,' + this.state.opacity + ')'
                }}
                // rightBtnIcon={Images.macau.call}
                // rightBtnPress={()=>{call(telephone)}}
                // rightImageStyle={{height: 20, width: 20, marginLeft: 20, marginRight: 20}}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}/>


            <View
                style={styles.btn_book}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        height: 60
                    }}
                    onPress={() => {
                        call(strNotNull(global.hotel_contact) ? global.hotel_contact : telephone)
                    }}>
                    <Image style={{width: 27, height: 23}} source={Images.macau.callPhone}/>
                    <Text style={{color: "#666666", fontSize: 14, marginLeft: 11}}>联系客服</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 1, backgroundColor: '#E54A2E', alignItems: 'center', height: 60,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        router.toHotelRoomListPage(this.state.hotel, this.props.params.date);
                    }}>
                    <Text style={styles.btn_book_txt}>预定房间</Text>
                </TouchableOpacity>
            </View>

            <PopAction
                ref={ref => this.popAction = ref}
                btnArray={this.popActions()}/>
        </View>
    }

    popActions = () => {
        const {title, location, amap_poiid, amap_navigation_url, amap_location} = this.state.hotel;
        let reportList = list;
        let resultArray = [];
        reportList.forEach((data, index) => {
            let item = {
                name: data.name, txtStyle: {color: '#4A90E2'}, onPress: () => {
                    if (strNotNull(amap_navigation_url)) {
                        this.popAction.toggle();
                        turn2MapMark(amap_location, amap_navigation_url, amap_poiid, location, title, data.type)
                    }

                }
            };
            resultArray.push(item);
        });
        resultArray.push({
            name: '取消',
            txtStyle: {color: Colors._AAA},
            onPress: () => this.popAction.toggle()
        });

        return resultArray;
    };

    _onScroll = (event) => {
        let offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= 200) {
            let opacity = offsetY / 200;
            this.setState({opacity: opacity});
        } else {
            this.setState({opacity: 1});
        }


    };
}

class Banner extends PureComponent {

    render() {

        const {banners} = this.props;
        if (banners && banners.length > 0) {
            let images = banners.map(item => {
                return {url: item.image}
            });
            return <View style={{height: 200}}>
                <Swiper
                    activeDotStyle={styles.activeDot}
                    dotStyle={styles.dot}
                    autoplayTimeout={3}
                    autoplay>
                    {banners.map((item, key) => {
                        return <TouchableOpacity
                            key={key}
                            onPress={() => {

                                router.toImageGalleryPage(images, key)
                            }}
                            activeOpacity={1}>
                            <Image style={styles.banner}
                                   source={{uri: item.image}}/>
                        </TouchableOpacity>

                    })}

                </Swiper>
            </View>
        }

        else
            return <View style={styles.banner}/>
    }
}