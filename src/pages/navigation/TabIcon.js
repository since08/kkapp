import React, {
    PureComponent
} from 'react';
import {
    Text, Image, View, StyleSheet,
    TouchableOpacity
} from 'react-native';
import I18n from '../../I18n/I18n';
import {Images,Colors} from '../../Themes';
import {connect} from 'react-redux';


class TabIcon extends PureComponent {

    componentDidMount() {
        setTimeout(() => {
            this.forceUpdate()
        }, 300)
    }

    render() {
        const {tab, focused} = this.props;
        return (
            <View>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Image style={this._imageStyle(tab)} source={this._imageTab(tab, focused)}/>
                    <Text style={[this._titleStyle(focused), {
                        fontSize: 10,
                        marginTop: 2
                    }]}>{this._title(tab)}</Text>
                </View>

            </View>
        );

    }

    _title = (tab) => {
        switch (tab) {
            case 'home':
                return '首页';
            case 'news':
                return '澳门圈';

            case 'me':
                return '我的';
            case 'mall':
                return '消息';
        }

    };

    _titleStyle = (focused) => {
        return focused ? styles.textStyle2 : styles.textStyle;
    };

    _imageTab = (tab, focused) => {
        switch (tab) {
            case 'home':
                return focused ? Images.home2 : Images.home;
            case 'news':
                return focused ? Images.information2 : Images.information;
            case 'me':
                return focused ? Images.mine2 : Images.mine;
            case 'mall':
                return focused ? Images.nav_malled : Images.nav_mall
        }
    };

    _imageStyle = (tab) => {
        switch (tab) {
            case 'home':
                return styles.bgHomeStyle;
            case 'news':
                return styles.bgInformationStyle;
            case 'me':
                return styles.bgRankStyle2;
            case 'mall':
                return styles.discover;
        }
    }
};

const styles = StyleSheet.create({

    textStyle: {
        color: '#AAAAAA'
    },
    textStyle2: {
        color: Colors._E54
    },
    discover: {
        height: 24,
        width: 21
    },
    bgInformationStyle: {
        width: 20,
        height: 23
    },
    bgRankStyle2: {
        height: 23,
        width: 20
    },
    bgHomeStyle: {
        height: 22,
        width: 22
    },
});

const bindAction = dispatch => ({});

const mapStateToProps = state => ({

    actionType: state.AccountState.actionType,
});

export default connect(mapStateToProps, bindAction)(TabIcon);