import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, KeyboardAvoidingView, FlatList, Modal
} from 'react-native';

const codes = [{id: 0, name: '大陆', code: '86'}, {id: 1, name: '香港', code: '852'}, {id: 2, name: '澳门', code: '853'}, {
    id: 3,
    name: '台湾',
    code: '886'
}];

export default class ExtArea extends Component {

    state = {
        visible: false
    };

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    _separator = () => {
        return <View style={{width: '100%', height: 1, backgroundColor: '#F3F3F3'}}/>
    };

    _renderItem = ({item}) => {
        const {id, name, code} = item;
        return (
            <TouchableOpacity style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', height: 50}}
                              onPress={() => {
                                  this.props.changed_ext(code);
                                  this.toggle();
                              }}>
                <Text style={{color: "#666666", fontSize: 14, marginLeft: 17}}>{name}</Text>
                <View style={{flex: 1}}/>
                <Text style={{color: "#666666", fontSize: 14, marginRight: 17}}>{code}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                onRequestClose={() => {

                }}
                visible={this.state.visible}
                style={{alignItems:'center'}}
            >
                <View style={this.props.type && this.props.type === 'ModalPrompt' ? {width: 300,alignSelf:'center'} : {flex: 1}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggle}
                        style={{height: this.props.type && this.props.type === 'ModalPrompt' ? 290 : 110}}/>
                    <FlatList
                        style={{}}
                        data={codes}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => `extArea${index}`}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggle} style={{flex: 1}}/>
                </View>
            </Modal>
        )
    }
}