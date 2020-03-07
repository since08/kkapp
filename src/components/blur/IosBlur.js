/**
 * Created by lorne on 2017/2/9.
 */
import React, {PropTypes} from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image,
    Text, ScrollView
} from 'react-native';
import {Metrics} from '../../Themes';


export default class IosBlur extends React.Component {

    static propTypes = {
        raceInfo: PropTypes.object
    }


    render() {
        const {raceInfo} =  this.props;
        return (
            <Image style={{height:200,
                width:Metrics.screenWidth}}
                   source={{uri:raceInfo.logo}}>
             

            </Image>
        )
    }
}