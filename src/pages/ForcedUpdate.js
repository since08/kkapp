import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, KeyboardAvoidingView, FlatList, Modal, Linking
} from 'react-native';
import * as Constants from "../configs/Constants";
import {logMsg} from "../utils/ComonHelper";


export default class ForcedUpdate extends Component {

    state = {
        visible: true
    };

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        })
    }


    render() {

        logMsg('更新数据', this.props.app_update)
        const {app_update} = this.props;
        let url = `${app_update.download_url}?version=${app_update.version}`;
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                onRequestClose={() => {

                }}
                visible={this.state.visible}
                style={{alignItems: 'center'}}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}>
                    <View style={{
                        paddingTop: 16,
                        paddingBottom: 20,
                        width: 260,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{color: '#000000', fontWeight: 'bold'}}>app升级提示</Text>
                        <Text style={{
                            color: '#000000',
                            marginTop: 7
                        }}>{`当前版本：${Constants.VERSION}  更新版本：${app_update.version}`}</Text>
                        <Text style={{color: '#000000', marginTop: 10}}>{app_update.content}</Text>

                        <TouchableOpacity style={{
                            backgroundColor: 'white',
                            width: 260,
                            marginTop: 10,
                            paddingTop: 15,
                            borderTopWidth: 1,
                            borderTopColor: '#F3F3F3',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                                          onPress={() => {
                                              Linking.openURL(url)
                                          }}>
                            <Text style={{color: '#007AFF'}}>前往更新</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        )
    }
}