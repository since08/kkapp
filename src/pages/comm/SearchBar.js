import React, {PureComponent} from 'react';
import {
    Image, Text, Platform, TextInput, View, StyleSheet
} from 'react-native';
import {Images, Colors, Metrics} from '../../Themes';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
    contains: {
        height: 30,
        width: '70%',
        backgroundColor: Colors._CD3,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    search: {
        height: 17,
        width: 17
    },
    txt_search: {
        fontSize: 14,
        color: Colors.white,
        marginLeft: 12
    },
    input: {
        position: 'absolute',
        flex: 1,
        paddingTop:4,
        paddingBottom:4,
        width: '90%',
        color: Colors.white,
        fontSize:16
    }
})


export default class SearchBar extends PureComponent {

    state = {
        text: ''
    }

    render() {
        const {text} = this.state;
        let hide = text.length > 0;
        return <Animatable.View
            // animation={'lightSpeedIn'}
            style={styles.contains}>

            <TextInput
                underlineColorAndroid={'transparent'}
                selectionColor={Colors.white}
                onChangeText={text => {
                    this.setState({text})
                    this.props.keyword(text)
                }}
                style={styles.input}/>
            {hide ? null : <Image source={Images.macau.search}
                                  style={styles.search}/>}

            {hide ? null : <Text style={styles.txt_search}>搜索</Text>}


        </Animatable.View>
    }
}