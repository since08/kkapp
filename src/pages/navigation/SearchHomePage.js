import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, Text, View, Image,
    TouchableOpacity, TextInput, StatusBar,
    Platform,SafeAreaView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from '../../I18n/I18n';
import StorageKey from "../../configs/StorageKey";
import {showToast, strNotNull} from "../../utils/ComonHelper";
import InfoList from './InfoList';

export default class SearchHomePage extends Component {

    state = {
        recordKeys: [],
        submit: false
    };

    componentWillMount() {
        this.setwords = new Set();
        this.keywords = '';
        storage.load({key: StorageKey.InfoSearchRecord})
            .then(ret => {
                if (ret.length > 20) {
                    ret = ret.slice(ret.length - 20)
                }
                this.setwords = new Set(ret.reverse());
                this.setState({
                    recordKeys: Array.from(this.setwords)
                })
            }).catch(err=>{})
    }

    render(){
        return (
            <View style={ApplicationStyles.bgContainer}>
                {this.TopBar()}
                <InfoList
                    ref={ref => this.infoList = ref}
                    isSearch={true}/>
                {this.state.submit ? null : <View style={styles.viewSearch}>
                    {this.resentBlank()}
                    {this.tabBlank()}
                </View>}


            </View>
        )
    }

    resentBlank = () => {
        return <View style={styles.resent}>
            <Text style={styles.txtRecent}>最近搜索</Text>
            <View style={{flex: 1}}/>
            <TouchableOpacity
                onPress={() => {
                    this.setwords.clear();
                    this.setState({
                        recordKeys: []
                    })
                }}
                style={styles.btnDel}>
                <Image style={styles.imgDel}
                       source={Images.mall_del}/>

            </TouchableOpacity>

        </View>
    };
    submitSearch = () => {
        if(strNotNull(this.keywords)){
            this.setwords.add(this.keywords);
            storage.save({
                key: StorageKey.InfoSearchRecord,
                data: Array.from(this.setwords)
            });
            this.setState({
                submit: true
            });
            if (this.infoList)
                this.infoList.search(this.keywords)
        }else{
            showToast('关键字不能为空')
        }

    };
    tabBlank = () => {

        let that = this;
        return <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: 19}}>
            {this.state.recordKeys.map(function (item, index) {
                return <TouchableOpacity
                    onPress={() => {
                        that.keywords = item;
                        that.submitSearch();
                    }}
                    key={`tab${index}`}
                    style={styles.tabSearch}>
                    <Text style={styles.txtTab}>{item}</Text>

                </TouchableOpacity>
            })}

        </View>
    }

    TopBar = () => {

        return (<View style={styles.navBar}>
            <SafeAreaView/>
            <View style={styles.navContent}>

                <View
                    style={styles.search}>
                    <Image
                        style={styles.searchImg}
                        source={Images.search_gray}/>


                    <TextInput
                        ref={ref => this.input = ref}
                        onChangeText={text => {
                            this.keywords = text;
                        }}
                        style={styles.txtSearch}
                        underlineColorAndroid='transparent'
                        returnKeyLabel={I18n.t('certain')}
                        clearButtonMode='always'
                        placeholderColor={Colors._AAA}
                        onSubmitEditing={this.submitSearch}
                        returnKeyType={'search'}
                        placeholder={`请输入关键字`}/>

                </View>
                <TouchableOpacity
                    onPress={() => {
                        global.router.pop()
                    }}
                    style={styles.btnCat}>
                    <Text>取消</Text>

                </TouchableOpacity>
            </View>

        </View>)


    };
}

const styles= StyleSheet.create({
    imgCat: {
        height: 20,
        width: 22
    },
    tabSearch: {
        borderRadius: 14,
        height: 28,
        paddingLeft: 17,
        paddingRight: 17,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E1E1E2',
        marginBottom: 16,
        marginRight: 12
    },
    txtTab: {
        fontSize: 14,
        color: Colors.txt_444
    },
    resent: {
        height: 45,
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtRecent: {
        fontSize: 14,
        color: Colors._333,
        marginLeft: 19
    },
    imgDel: {
        height: 22,
        width: 22
    },
    btnDel: {
        height: 45,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCat: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtSearch: {
        color: Colors.txt_444,
        fontSize: 12,
        height: Platform.OS === 'ios' ? 30 : 40,
        width: 210
    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44
    },
    search: {
        height: 28,
        width: 270,
        backgroundColor: Colors._ECE,
        borderRadius: 3,
        marginLeft: 17,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchImg: {
        height: 17,
        width: 17,
        marginLeft: 14,
        marginRight: 9,
        opacity: 0.8
    },
    navBar: {
        width: '100%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Colors._ECE
    },
    viewSearch: {
        position: 'absolute',
        top: Metrics.navBarHeight,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors._ECE
    }
})


