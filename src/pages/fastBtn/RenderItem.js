import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, InteractionManager, FlatList
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {call} from "../../utils/ComonHelper";
import styles from './fastStyles'

export default class RenderItem extends Component {

    render() {
        const {item} = this.props;
        return (
            <View style={{
                flexDirection: 'row',
                paddingTop: 20,
                paddingBottom: 20,
                alignItems: 'center',
                backgroundColor: 'white',paddingLeft:17,paddingRight:20
            }}>
                <View style={{flexDirection: 'column', width: '80%'}}>
                    <Text style={styles.txt2}>{item.title}</Text>
                    <Text selectable={true} style={[styles.txt1, {marginTop: 6}]}>{item.telephone}</Text>
                </View>
                <View style={{flex: 1}}/>
                <TouchableOpacity onPress={() => {
                    call(item.telephone)
                }}>
                    <Image style={styles.img} source={Images.navigation2.hotline}/>
                </TouchableOpacity>
            </View>
        )
    }
}