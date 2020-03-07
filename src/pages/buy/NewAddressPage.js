/**
 * Created by lorne on 2017/7/6.
 */
import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput, Keyboard,
    StyleSheet, Image, Text, ScrollView, Platform
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import I18n from "../../I18n/I18n";
import {strNotNull, showToast, checkPhone, isEmptyObject,checkZip} from '../../utils/ComonHelper';
import {postAddress} from '../../services/OrderDao';
import ChinaRegionWheelPicker from '../../components/area-picker';

export default class NewAddress extends Component {

    state = {
        isDefault: false,
        regionVisible: false,
        regionTxt: '',
        addressEdit: {},
        province: '',
        city: '',
        area: ''
    };

    componentDidMount() {
        const {address} = this.props.params;

        console.log(address)
        if (!isEmptyObject(address)) {
            const {province, city, area} = address;
            this.receiver = address.consignee;
            this.receiverAdr1 = `${province} ${city} ${area}`;
            this.receiverAdr2 = address.address;
            this.phoneNum = address.mobile;
            this.zip = address.zip;
        }

        this.setState({
            addressEdit: address,
            regionTxt: isEmptyObject(this.receiverAdr1) ? '' : this.receiverAdr1,
            isDefault: isEmptyObject(address) ? false : address.default,
            province: address.province,
            city: address.city,
            area: address.area
        });

    }

    _getName = () => {
        const {consignee} = this.state.addressEdit;
        return consignee;
    };
    _getPhone = () => {
        const {mobile} = this.state.addressEdit;
        return mobile;
    };

    _getZip = () => {
        const {zip} = this.state.addressEdit;
        return zip;
    }

    _getAdrDetail = () => {
        const {address} = this.state.addressEdit;
        return address;
    };

    _getTitle = () => {
        if (isEmptyObject(this.state.addressEdit)) {
            return I18n.t('add_new_adr');
        } else
            return I18n.t('buy_editor_adr');
    };

    render() {
        return (<View style={ApplicationStyles.bgContainer}>
            <NavigationBar
                refreshPage={this.refreshPage}
                toolbarStyle={{backgroundColor: Colors._E54}}
                rightBtnPress={this._postAdr}
                title={this._getTitle()}
                rightBtnText={I18n.t('save')}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}/>

            <View style={styles.view1}>
                <View style={styles.inputView}>
                    <Text style={styles.lbAdr}>{I18n.t('buy_person')}:</Text>
                    <TextInput style={styles.input}
                               maxLength={10}
                               underlineColorAndroid={'transparent'}
                               defaultValue={this._getName()}
                               onChangeText={txt => {
                                   this.receiver = txt;
                               }}/>
                </View>
                <View style={styles.line}/>
                <View style={styles.inputView}>
                    <Text style={styles.lbAdr}>{I18n.t('line')}: </Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid={'transparent'}
                               defaultValue={this._getPhone()}
                               onChangeText={txt => {
                                   this.phoneNum = txt;
                               }}/>
                </View>
                <View style={styles.line}/>
                <View style={styles.inputView}>
                    <Text style={styles.lbAdr}>邮政编码: </Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid={'transparent'}
                               defaultValue={this._getZip()}
                               onChangeText={txt => {
                                   this.zip = txt;
                               }}/>
                </View>
                <View style={styles.line}/>
                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        this.setState({
                            regionVisible: !this.state.regionVisible
                        })
                    }}
                    style={styles.inputView}>
                    <Text style={styles.lbAdr}>{I18n.t('buy_adr')}</Text>
                    <Text style={styles.lbAdr}>{this.state.regionTxt}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.txtSelect}>{I18n.t('buy_ple_choice')}</Text>
                    <Image style={styles.imgRight}
                           source={Images.adr_right}/>

                </TouchableOpacity>
                <View style={styles.line}/>
                <View style={styles.inputAdrView}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        numberOfLines={2}
                        maxLength={45}
                        style={styles.inputAdr}
                        defaultValue={this._getAdrDetail()}
                        placeholder={I18n.t('buy_adr_name')}
                        placeholderTextColor={'#AAAAAA'}
                        onChangeText={txt => {
                            this.receiverAdr2 = txt;
                        }}/>
                </View>

            </View>

            <View style={styles.view2}>
                <Text style={styles.lbDefault}>{I18n.t('buy_set_adr')}</Text>

                <Text style={styles.lbRemark}>{I18n.t('buy_zhu')}</Text>

                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isDefault: !this.state.isDefault
                        })
                    }}
                    style={styles.btnSwitch}>
                    <Image style={styles.imgSwitch}
                           source={this.state.isDefault ? Images.handle : Images.handle2}/>
                </TouchableOpacity>


            </View>

            <ChinaRegionWheelPicker
                transparent
                animationType={'fade'}
                isVisible={this.state.regionVisible} //true展示，false不展示
                onSubmit={(params) => {
                    console.log(params)
                    const {province, city, area} = params;
                    this.receiverAdr1 = province.name + ' ' + city.name + ' ' + area.name;
                    this.setState({
                        regionVisible: false,
                        regionTxt: this.receiverAdr1,
                        province: province.name,
                        city: city.name,
                        area: area.name,
                    })
                }}
                onCancel={() => {
                    this.setState({
                        regionVisible: false
                    })
                }}
            />
        </View>)
    }


    _postAdr = () => {
        if (!strNotNull(this.phoneNum)) {
            showToast("手机号不能为空");
            return
        }

        if(this.receiverAdr2 && this.receiverAdr2.length<=5){
            showToast("详细地址不少于五个字");
            return;
        }
        if (this.receiver &&
            this.receiverAdr1 && this.receiverAdr2) {
            const body = {
                consignee: this.receiver,
                mobile: this.phoneNum,
                address: this.receiverAdr2,
                default: this.state.isDefault,
                province: this.state.province,
                city: this.state.city,
                area: this.state.area,
                zip: this.zip

            };


            if (!isEmptyObject(this.state.addressEdit)) {
                const {id} = this.state.addressEdit;
                body['id'] = id
            }
            postAddress(body, data => {
                showToast(I18n.t('buy_put_success'));
                this.props.params.getList();
                router.pop();

            }, err => {
                showToast(err)
                console.log(err)
            })


        } else {
            showToast(I18n.t('fillWhole'))
        }
    }


}


const styles = StyleSheet.create({
    inputView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

    },
    lbAdr: {
        fontSize: 15,
        color: '#444444',
        marginLeft: 17
    },
    input: {
        height: 50,
        fontSize: 15,
        color: '#444444',
        flex: 1
    },
    line: {
        height: 0.5,
        backgroundColor: Colors.bg_f5
    },
    inputAdr: {
        marginLeft: 17,
        marginTop: 17,
        height: 60,
        fontSize: 15,
        color: '#444444',
        justifyContent: 'flex-start',

    },
    view1: {
        backgroundColor: 'white',
        marginTop: 8,
        marginBottom: 10

    },
    inputAdrView: {
        height: 80,
    },
    view2: {
        height: 90,
        backgroundColor: 'white'
    },
    lbDefault: {
        fontSize: 15,
        color: '#444444',
        marginLeft: 17,
        marginTop: 17
    },
    lbRemark: {
        fontSize: 14,
        color: '#AAAAAA',
        marginLeft: 17,
        marginTop: 21
    },
    btnSwitch: {
        height: 32,
        width: 53,
        position: 'absolute',
        top: 9,
        right: 19
    },
    imgSwitch: {
        height: 32,
        width: 53,
    },
    imgRight: {
        height: 20,
        width: 11,
        marginRight: 17
    },
    txtSelect: {
        fontSize: 14,
        color: '#AAAAAA',
        marginRight: 6
    }
});