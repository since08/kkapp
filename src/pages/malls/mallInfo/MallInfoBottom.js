import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import I18n from '../../../I18n/I18n';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {isEmptyObject} from '../../../utils/ComonHelper';

export default class MallInfoBottom extends Component {

    static propTypes = {
        showSpecInfo: PropTypes.func.isRequired
    };

    componentDidMount() {

    }


    render() {

        return (
            <View style={styleB.mallBottom}>
                <TouchableOpacity
                    style={styleB.shoppingCar}
                    onPress={() => {
                        router.replaceShoppingCart()
                    }}>
                    <Image style={styleB.shoppingCarImg} source={Images.shoppingCart}/>
                    {this.countView()}

                </TouchableOpacity>

                <View style={{width:20}}/>



                <TouchableOpacity
                    onPress={() => {
                        if (isEmptyObject(global.login_user))
                            global.router.toLoginFirstPage();
                        else
                             this.props.showSpecInfo({},'cart');

                    }}
                    style={[styleB.joinShoppingCar,{backgroundColor:'white',  borderColor: '#EEEEEE',borderWidth:1}]}>
                    <Text style={[styleB.joinShoppingCarTxt,{color:Colors.txt_444}]}>{I18n.t('add_cart')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (isEmptyObject(global.login_user))
                            global.router.toLoginFirstPage();
                        else
                            this.props.showSpecInfo({},'buy');

                    }}
                    style={styleB.joinShoppingCar}>
                    <Text style={styleB.joinShoppingCarTxt}>直接购买</Text>
                </TouchableOpacity>
            </View>
        );
    }

    countView = () => {
        let count = global.shoppingCarts.length;
        if (count > 0)
            return <View

                style={styleB.shoppingCarView}>
                <Text style={styleB.shoppingCarTxt}>{count}</Text>
            </View>
    }
}

const styleB = StyleSheet.create({
    mallBottom: {
        height: 50,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        zIndex: 99
    },
    shoppingCar: {
        borderRadius: 3,
        width: 60,
        height: 40,
        marginLeft: 17,
        alignItems: 'center',
        justifyContent: 'center'
    },
    joinShoppingCar: {
        backgroundColor: '#F34A4A',
        borderRadius: 3,
        height: 40,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
    shoppingCarImg: {
        width: 24,
        height: 23
    },
    shoppingCarView: {
        backgroundColor: '#F34A4A',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 30,
        bottom: 15
    },
    shoppingCarTxt: {
        fontSize: 12,
        color: '#FFFFFF'
    },
    joinShoppingCarTxt: {
        fontSize: 15,
        color: '#FFFFFF'
    }
})