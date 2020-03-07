import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, Platform, Linking
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import Swiper from 'react-native-swiper';
import {sunnaDetail} from '../../services/MacauDao';
import RenderHtml from '../comm/RenderHtml';
import {NavigationBar} from '../../components'
import {call, strNotNull, turn2MapMark} from '../../utils/ComonHelper';
import PopAction from '../comm/PopAction';

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

export default class SunnaInfoPage extends PureComponent {

    state = {
        sunna: {},
        opacity: 0,
        targetAppName: 'gaode',
        showSelect: false
    }

    componentWillMount() {
        const {id} = this.props.params.item;
        sunnaDetail({id: id}, data => {
            console.log("sunna_info:", data)
            this.setState({
                sunna: data.sauna
            })
        }, err => {
            console.log("sunna_info_err", err)
        })
    };

    _star = (star) => {
        let stars = [];
        for (let i = 1; i <= star; i++) {
            stars.push(i);
        }
        return stars;
    };

    render() {
        const {logo, location, title, description, telephone, star_level, amap_poiid, amap_navigation_url, price, amap_location} = this.state.sunna;
        return <View style={ApplicationStyles.bgContainer}>


            <ScrollView
                iosalwaysBounceVertical={false}
                scrollEventThrottle={16}
                onScroll={this._onScroll}>
                <Image source={{uri: logo}} style={{height: 200, width: '100%'}}/>

                <View style={styles.nav_view}>

                    <View style={{width: '70%'}}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                            <Text style={{color: '#999999', fontSize: 12}}>服务星级：</Text>
                            {this._star(star_level).map((index) => {
                                return <Image key={index} style={styles.stars} source={Images.macau.star}/>
                            })}
                        </View>
                        <TouchableOpacity onPress={() => {
                            call(telephone)
                        }}
                        style={{marginTop:8}}>
                            <Text style={{color: '#999999',fontSize: 12}} numberOfLines={1}>联系电话：{telephone}</Text>
                        </TouchableOpacity>
                        <Text selectable={true} style={styles.location2} numberOfLines={2}>地址：{location}</Text>
                    </View>
                    <View style={{flex: 1}}/>

                    <View style={{marginRight: 22, flexDirection: 'column', alignItems: 'flex-end'}}>
                        {/*<Text style={styles.price3}><Text*/}
                        {/*style={{*/}
                        {/*color: '#FF3F3F',*/}
                        {/*fontSize: 12*/}
                        {/*}}>{`人均¥${strNotNull(price) ? price : ''}`}</Text>*/}
                        {/*</Text>*/}
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
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}
                rightBtnIcon={Images.phone}
                rightImageStyle={{marginRight: 17, height: 22, width: 22}}
                rightBtnPress={() => {
                    call(telephone)
                }}/>

            <PopAction
                ref={ref => this.popAction = ref}
                btnArray={this.popActions()}/>
        </View>
    }

    popActions = () => {
        const {title, location, amap_poiid, amap_navigation_url, amap_location} = this.state.sunna;
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
}