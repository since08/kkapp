import React, {PureComponent} from 'react';
import {
    View, Text, Button, Alert, DatePickIOS,
    Image, StyleSheet, ActivityIndicator,
    TouchableOpacity, ScrollView, FlatList
}
    from 'react-native';
import {Images, Colors, Metrics} from '../../Themes';
import {ImageLoad} from "../../components";
import moment from "moment/moment";
import {strNotNull} from "../../utils/ComonHelper";
import {reallySize} from "../socials/Header";

const styles = StyleSheet.create({
    informationLine: {
        height: 1,
        marginLeft: 17,
        marginRight: 17,
        backgroundColor: 'red',
        marginTop: 13
    },
    item_hotel: {
        height: 100,
        marginLeft: 17,
        marginRight: 17,
        flex: 1
    },
    row_center: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    hotel_title: {
        fontSize: 16,
        color: Colors.txt_444
    },
    hotel_location: {
        fontSize: 12,
        color: Colors._AAA
    },
    hotel: {
        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: '#E54A2E',
        borderWidth: 1,
        color: '#E54A2E',
        fontSize: 12,
        marginLeft: 8,
        borderRadius: 2
    },
    info_tag: {
        color: '#F5A623',
        borderColor: '#F5A623'
    },
    hot_info: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.txt_444,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 17
    }

})

export default class Information extends PureComponent {

    state = {
        hot_infos: [{type: 'hotel'}, {type: 'info'}]
    };

    refresh = (infos) => {
        console.log('hot_infos', infos);
        this.setState({hot_infos: infos})
    }

    setInfos = (infos) => {
        console.log('hot_infos', infos);
        let {hot_infos} = this.state;

        this.setState({hot_infos: hot_infos.concat(infos)})
    };


    _renderItem = ({item}) => {
        switch (item.source_type) {
            case 'hotel':
                return <ItemHotel
                    hotel={item.hotel}/>
            case 'info':
                return <ItemInfo
                    info={item.info}/>
        }


    };


    render() {
        return (
            <View style={{backgroundColor: '#fff', marginTop: 8}}>

                <Text style={styles.hot_info}>热门推荐</Text>

                {_separator()}

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={_separator}
                    data={this.state.hot_infos}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index + "item"}
                />


            </View>
        );
    }

}

_separator = () => {
    return <View style={{height: 0.5, marginLeft: 17, marginRight: 17, backgroundColor: '#ECECEE'}}/>;
}

class ItemInfo extends PureComponent {

    show_count = (item) => {
        if (strNotNull(item)) {
            if (item >= 1000  || item.length > 3) {
                return '999+'
            } else {
                return item
            }
        } else {
            return 0
        }
    }

    render() {
        const {title, id, date, image, type, likes_count, comments_count, total_views} = this.props.info;
        return <TouchableOpacity
            onPress={() => {
                router.toInfoPage({id})
            }}
            style={[{
                marginLeft: 17,
                marginRight: 17,
            }]}>
            <View style={[styles.row_center, {
                marginTop: 9,
                marginBottom: 9,
                width: Metrics.screenWidth - 34
            }]}>
                <Text
                    numberOfLines={2}
                    style={[styles.hotel_title, {maxWidth: Metrics.screenWidth - 85}]}>{title}</Text>
                <View style={{flex: 1}}/>
                <Text style={[styles.hotel, styles.info_tag]}>{type.name}</Text>
            </View>

            <ImageLoad
                source={{uri: image}}
                style={{height: Metrics.reallySize(164), width: '100%'}}/>

            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop:10,
                marginBottom: 10
            }}>


                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: Colors._AAA}}>阅读</Text>
                    <Text style={{
                        fontSize: 12,
                        color: Colors._AAA,
                        marginLeft: 4
                    }}>{total_views}</Text>
                    <View style={{flex:1}}/>
                    <Image
                        style={{height: reallySize(12), width: reallySize(12)}}
                        source={Images.social.like_gray}/>
                    <Text style={{
                        fontSize: 12,
                        color: Colors._AAA,
                        marginRight:20,
                        marginLeft:4
                    }}>{this.show_count(likes_count)}</Text>

                    <Image
                        style={{height: reallySize(12), width: reallySize(12)}}
                        source={Images.social.reply}/>
                    <Text style={{

                        fontSize: 12,
                        color: Colors._AAA,
                        marginLeft:4
                    }}>{this.show_count(comments_count)}</Text>
                </View>
            </View>

        </TouchableOpacity>
    }
}


class ItemHotel extends PureComponent {


    render() {
        const {title, id, location, logo, type} = this.props.hotel;

        return <TouchableOpacity
            onPress={() => {
                // router.toHotelDetail({id})
                router.toHotelRoomListPage(this.props.hotel, {
                    begin_date: moment().format('YYYY-MM-DD'),
                    end_date: moment().add('hours', 24).format('YYYY-MM-DD'),
                    counts: 1
                })
            }}
            style={[styles.item_hotel, styles.row_center,]}>

            <View style={{height: 75, marginRight: 15, flex: 1}}>
                <View style={[styles.row_center, {width: '80%'}]}>
                    <Text

                        numberOfLines={1}
                        style={styles.hotel_title}>{title}</Text>
                    <Text style={styles.hotel}>酒店</Text>
                </View>

                <Text
                    numberOfLines={1}
                    style={[styles.hotel_location, {
                        marginTop: 8
                    }]}>{location}</Text>

                <View style={{flex: 1}}/>

                {/*<View style={[styles.row_center, {justifyContent: 'space-between'}]}>*/}

                {/*<Text*/}
                {/*numberOfLines={1}*/}
                {/*style={styles.hotel_location}>阅 224</Text>*/}

                {/*<Text*/}
                {/*numberOfLines={1}*/}
                {/*style={styles.hotel_location}>5-23</Text>*/}
                {/*</View>*/}

            </View>


            <ImageLoad
                source={{uri: logo}}
                style={{height: 75, width: 122}}/>
        </TouchableOpacity>
    }
}

