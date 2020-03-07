/**
 * Created by lorne on 2018/5/13
 * Function:
 * Desc:
 */
import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, InteractionManager
} from 'react-native';

export default class RejectPage extends Component {

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 14, color: '#888888'}}>网络出小差啦～～</Text>
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 25,
                        borderRadius: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E54A2E',
                        marginTop: 8
                    }}
                    onPress={() => {
                        this.props.refresh()
                    }}>
                    <Text style={{fontSize: 14, color: '#FFFFFF'}}>刷新</Text>
                </TouchableOpacity>
            </View>
        )
    }
}