import React, {PureComponent} from 'react';
import {
    StyleSheet, Text, View, Image,
    TouchableOpacity, Platform,
    StatusBar,SafeAreaView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';


export default class HomeTabBar extends PureComponent {

    render() {
        return (<View style={[styles.navBar,this.props.backStyle]}>
            <SafeAreaView/>
            <StatusBar barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"}/>

            <View style={styles.navContent}>
                <View style={{marginLeft: 17, flex: 1}}/>
                <TouchableOpacity
                    onPress={() => {
                        global.router.toSearchHomePage()
                    }}
                    style={styles.search}>
                    <Image style={styles.searchImg}
                           source={Images.search_gray}/>
                    <Text style={styles.txtSearch}>请输入关键字</Text>

                </TouchableOpacity>
                <View style={{flex: 1}}/>

                <TouchableOpacity
                    onPress={() => {
                        global.router.toActivitiesPage()
                    }}>
                    <Image style={styles.imgCat}
                           source={Images.gift}/>
                </TouchableOpacity>
            </View>

        </View>)

    }
}

const styles = StyleSheet.create({
    cancel: {
        fontSize: 14,
        color: Colors.white,
        marginRight:17
    },
    navBar: {
        width: '100%',
        position: 'absolute',
        zIndex: 9

    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44
    },
    search: {
        width: 250,
        height: 30,
        backgroundColor: 'rgba(236, 236, 237,0.959)',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchImg: {
        height: 17,
        width: 17,
        marginLeft: 15,
        marginRight: 9
    },
    txtSearch: {
        color: Colors._AAA,
        fontSize: 12
    },
    imgCat: {
        width: 30, height: 30, marginRight: 17
    }
});