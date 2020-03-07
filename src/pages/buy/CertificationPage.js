/**
 * Created by lorne on 2017/2/20.
 */
import React, {Component}from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import {connect} from 'react-redux';
import I18n from "../../I18n/I18n";
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import IDCardView from './IDCardView';
import PassportView from './PassportView';

export default class CertificationPage extends Component {


    render() {
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    toolbarStyle={{backgroundColor:Colors._E54}}
                    title={I18n.t('certification')}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height:19,width:11,marginLeft:20,marginRight:20}}
                    leftBtnPress={()=>router.pop()}/>


                <IDCardView
                    tabLabel={I18n.t('identification')}/>

                {/*<ScrollableTabView>*/}
                    {/*<IDCardView*/}
                        {/*tabLabel={I18n.t('identification')}/>*/}
                    {/*<PassportView tabLabel={I18n.t('passport')}/>*/}
                {/*</ScrollableTabView>*/}


            </View>
        )
    }
}