import React, {PureComponent} from 'react';
import {
    View, Text, Alert,
    Image, StyleSheet,
    TouchableOpacity, ImageBackground
} from 'react-native';
import {ApplicationStyles, Images, Colors, Metrics} from '../../Themes';
import {getPosition, isEmptyObject, logMsg, strNotNull} from "../../utils/ComonHelper";
import {getApiType} from "../../services/RequestHelper";
import {locations} from "../../services/SocialDao";

export default class HotCatalogs extends PureComponent {

    render() {
        const {home_imgs} = this.props;
        logMsg("home_imgs",home_imgs)
        return (
            <View style={styles.hotView}>
                <View style={styles.viewLeft}>
                    <TouchableOpacity onPress={() => {
                        global.router.toSelectTimePage();
                    }} style={styles.leftTop}>
                        <Image style={styles.leftTop}
                                         source={!isEmptyObject(home_imgs) && strNotNull(home_imgs.hotel_image) ? {uri:home_imgs.hotel_image} : Images.navigation2.hotel_bg}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        global.router.toRatePage();
                    }}>
                        <Image style={[styles.leftBottom, {marginTop: 4}]}
                                         source={!isEmptyObject(home_imgs) && strNotNull(home_imgs.rate_image) ? {uri:home_imgs.rate_image} : Images.navigation2.rate_bg}/>
                    </TouchableOpacity>

                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity onPress={() => {
                        global.router.toHotelSearch({
                            name: '美食',
                            type: 'cate',
                            size: {height: 35, width: 34},
                            icon: Images.macau.food
                        })
                    }}>
                        <Image style={styles.leftBottom}
                                         source={!isEmptyObject(home_imgs) && strNotNull(home_imgs.cate_image) ? {uri:home_imgs.cate_image} : Images.navigation2.info_ng}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        global.router.toRecreationPage({
                            name: '休闲娱乐',
                            type: 'recreation',
                            size: {height: 34, width: 36},
                            icon: Images.macau.entertainment,
                            refresh: this.refresh
                        });
                    }}>
                        <Image style={[styles.leftTop, {marginTop: 4}]}
                                         source={!isEmptyObject(home_imgs) && strNotNull(home_imgs.recreation_image) ? {uri:home_imgs.recreation_image} : Images.navigation2.rec_bg}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    txt1: {
        color: '#FFFFFF',
        fontSize: 18
    },
    txt2: {
        color: '#FFFFFF',
        fontSize: 14
    },
    hotView: {
        marginTop: 4,
        width: Metrics.screenWidth,

        flexDirection: 'row'
    },
    viewLeft: {
        marginLeft: 4,
        flex: 1
    },
    viewRight: {
        marginLeft: 4,
        marginRight: 4,
        flex: 1
    },
    leftTop: {
        width: (Metrics.screenWidth - 12)/2,
        height: (((Metrics.screenWidth - 12)/2) * 472) /360,
        borderRadius: 2
    },
    leftBottom: {
        width: (Metrics.screenWidth - 12)/2,
        height: (((Metrics.screenWidth - 12)/2) * 188) /360,
        borderRadius: 2
    }
});


