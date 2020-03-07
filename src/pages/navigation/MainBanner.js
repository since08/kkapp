import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View, Image,
    TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-swiper';
import {Metrics} from '../../Themes'

const Height = Metrics.reallySize(164)
export default class MainBanner extends Component {

    render() {
        const {banners} = this.props;
        if (banners && banners.length > 0)
            return (
                <View style={{height: Height}}>
                    <Swiper
                        activeDotStyle={stylesM.activeDot}
                        dotStyle={stylesM.dot}
                        autoplayTimeout={3}
                        autoplay>
                        {this.props.banners.map((item, key) => {
                            return <TouchableOpacity
                                onPress={() => this.onClickBanner(item)}
                                key={`banner${item.source_id}`}
                                activeOpacity={1}>
                                <Image style={{height: Height, width: '100%'}} source={{uri: item.image}}/>
                            </TouchableOpacity>

                        })}

                    </Swiper>
                </View>


            );
        else
            return <View style={{height: Height}}/>
    }

    onClickBanner = (item) => {
        const {source_type, source_id} = item;
        if (source_type === 'hotel') {
            router.toHotelDetail({id: source_id})
        } else if (source_type === 'info') {
            router.toInfoPage({id: source_id})
        }

    }


}

const stylesM = StyleSheet.create({
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
    }

});