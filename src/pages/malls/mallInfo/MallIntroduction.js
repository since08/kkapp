import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Image} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../../Themes';
import I18n from '../../../I18n/I18n';
import RenderHtml from '../../comm/RenderHtml';

export default class MallIntroduction extends Component {

    componentDidMount() {

    };


    markdownView = () => {
        if (this.props.product.hasOwnProperty('description')) {
            const {description} = this.props.product;
            return <View style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingLeft: 17,
                paddingRight: 17,
                paddingBottom: 70
            }}>
                <RenderHtml
                    html={description}/>
            </View>
        }

    };


    render() {
        return (
            <View style={styleI.production}>
                <View style={styleI.productionName}>
                    <Text style={styleI.productionNameTxt}>{I18n.t('mallIntroduction')}</Text>
                </View>
                <View style={{height: 1, backgroundColor: Colors._ECE, width: '100%'}}/>
                {this.markdownView()}

            </View>
        );
    }
}

const styleI = StyleSheet.create({
    production: {
        marginTop: 5,
        backgroundColor: 'white'
    },
    productionName: {
        height: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center'
    },
    productionNameTxt: {
        fontSize: 14,
        color: '#333333',
        marginLeft: 17,

        fontWeight: 'bold'
    }
})