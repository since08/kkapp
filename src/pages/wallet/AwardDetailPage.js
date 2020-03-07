import React, {Component} from 'react';
import {
    FlatList, ScrollView,
    StyleSheet, Text,
    View, Image,
    TouchableOpacity
} from 'react-native';
import {ApplicationStyles, Colors, Images, Metrics} from "../../Themes";
import {utcDate, isEmptyObject} from "../../utils/ComonHelper";
import {NavigationBar} from '../../components';
import {award_details} from "../../services/WallDao";
import Details from './Details';

export default class AwardDetailPage extends Component {

    state = {
        award_details: []
    };



    render() {
        const {award_details} = this.state;
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._FFF}}
                    title={'邀请奖励明细'}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <Details type={'AwardDetail'}/>


            </View>
        )
    }



};