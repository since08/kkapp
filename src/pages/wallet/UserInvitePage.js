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
import InviteDetails from './InviteDetails';


export default class UserInvitePage extends Component {

    state = {
        count: 0
    };

    changed_length = (count) => {
        this.setState({
            count: count
        })
    }

    render() {
        const {user_invite} = this.props.params;

        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    titleStyle={{fontSize: 18, color: '#444444'}}
                    refreshPage={this.refreshPage}
                    toolbarStyle={{backgroundColor: Colors._FFF}}
                    title={`我的邀请好友-${this.state.count}人`}
                    leftBtnIcon={Images.coupon.return_hei}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}/>

                <InviteDetails
                               next_step={user_invite.next_step}
                               type={'2'}
                               changed_length={this.changed_length}/>
            </View>
        )
    }


};