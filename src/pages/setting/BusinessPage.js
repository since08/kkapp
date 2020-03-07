/**
 * Created by lorne on 2017/3/8.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput, Alert,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import I18n from '../../I18n/I18n';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar, SetItemView, Button} from '../../components';
import {call} from '../../utils/ComonHelper';
import {getContacts} from "../../services/AccountDao";
import StorageKey from "../../configs/StorageKey";

export default class BusinessPage extends Component {

    state = {
        contacts: {}
    }


    componentDidMount() {
        getContacts(data => {
            this.setState({
                contacts: data
            })
        }, err => {
        })
    }

    render() {
        const {contacts} = this.state;
        return (<View
            testID="page_business"
            style={ApplicationStyles.bgContainer}>
            <NavigationBar
                toolbarStyle={{backgroundColor: Colors._E54}}
                title={I18n.t('business_cooperation')}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}/>

            <View style={{backgroundColor: Colors.setting, height: 50, flexDirection:'row',alignItems: 'center'}}>
                <Text style={[Fonts.H17, {
                    marginLeft: 17,
                    marginRight: 17,
                    color: '#333333',
                    fontSize: 16
                }]}>商务合作</Text>
                <View style={{flex:1}}/>
                <Text
                    style={[Fonts.H16, {
                        marginLeft: 17,
                        marginRight: 17,
                        color: Colors._AAA,
                        fontSize: 16
                    }]}
                    selectable={true}>{contacts.email}</Text>
            </View>
            <TouchableOpacity
                style={{backgroundColor: Colors.setting,marginTop: 1,  height: 50, flexDirection:'row',alignItems: 'center'}}
                onPress={() => {
                    call(contacts.mobile)
                }}>
                <Text style={[Fonts.H17, {
                    marginLeft: 17,
                    marginRight: 17,
                    color: '#333333',
                    fontSize: 16
                }]}>联系电话</Text>
                <View style={{flex:1}}/>
                <Text style={[Fonts.H16, {
                    marginLeft: 17,
                    marginRight: 17,
                    color: Colors._AAA,
                    fontSize: 16
                }]}
                    selectable={true}>{contacts.mobile}</Text>
            </TouchableOpacity>

        </View>)
    }

    _hotLine = () => {
        Alert.alert(I18n.t('business_cooperation'), I18n.t('hot_phone'),
            [{
                text: I18n.t('cancel'), onPress: () => {
                }
            },
                {
                    text: I18n.t('call'), onPress: () => {
                        call(I18n.t('hot_phone'))
                    }
                }])
    }

}