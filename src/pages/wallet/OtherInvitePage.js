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
import {other_invite, user_invite} from "../../services/WallDao";
import InviteDetails from './InviteDetails';


export default class OtherInvitePage extends Component {

    state = {
        count: 0
    };

    changed_length = (count) => {
        this.setState({
            count: count
        })
    }


    render() {
        const {item} = this.props.params;
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    refreshPage={this.refreshPage}
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    toolbarStyle={{backgroundColor: Colors._FFF}}
                    title={`${item.nick_name.length > 2 ? '...' : item.nick_name}的邀请好友-${this.state.count}人`}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <InviteDetails user_id={this.props.params.item.user_id}
                               next_step={false}
                               type={'3'}
                               changed_length={this.changed_length}/>

            </View>
        )
    }


};