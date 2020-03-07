/**
 * Created by lorne on 2017/2/17.
 */
import React from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';

export default class RaceInfoBottomView extends React.Component{


    render(){
        return (<TouchableOpacity
            activeOpacity={1}
            testID="btn_buy"
            onPress={this.props.onPress}
            style={{height:50,borderRadius:3,
                        backgroundColor:Colors._E54,flexDirection:'row',
                        alignItems:'center',justifyContent: 'center',
                        position:'absolute',bottom: 5,left: 15,right: 15}}>
            <Text style={{color:Colors.white,
                                fontSize:18}}>{I18n.t('buy_ticket')}</Text>

        </TouchableOpacity> )
    }
}