/**
 * Withdraw.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/7/12.
 *
 */

import React, {Component} from 'react';
import {
    TouchableOpacity, ScrollView,KeyboardAvoidingView,
    StyleSheet,
    Text, Image,
    View, TextInput
} from 'react-native';
import {Images, Colors, Metrics} from '../../Themes';
import styles from './wallet.style'
import {BaseComponent, NavigationBar, Input} from '../../components'
import PopAction from "../comm/PopAction";
import {alertOrder, moneyFormat, showToast, strNotNull} from "../../utils/ComonHelper";
import {postWithdrawal} from '../../services/WallDao'

const list = [{id: 0, name: '支付宝', account_type: 'alipay'}, {id: 1, name: '银行卡', account_type: 'bank'}];

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            way: '支付宝',
            amount: '',
            prompt_show: false,

            account_number: '',
            account_type: 'alipay'

        };
        this.name = '';
        this.bank = ''
    }


    componentWillUnmount(){
        console.log("钱包componentWillUnmount")
        this.props.params.refresh();
    }

    render() {
        const {way, amount, prompt_show, account_number, account_type} = this.state;
        const {total_account} = this.props.params;

        return <BaseComponent>
            <NavigationBar
                toolbarStyle={{backgroundColor: Colors._E54}}
                title="提现"
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => {
                    router.pop();

                }}/>

            <ScrollView>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={20}>

                    <View style={styles.card2}>
                        <Text style={styles.txt_withdraw}>提现金额</Text>
                        <View style={styles.item_input}>
                            <Text style={[styles.money, {marginRight: 8}]}>¥</Text>
                            <TextInput
                                // autoFocus={true}
                                keyboardType={'numeric'}
                                style={{
                                    width: 300,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    fontSize: strNotNull(amount) ? 30 : 20,
                                    fontWeight: 'bold',
                                    color: '#444444'
                                }}
                                maxLength={4}
                                numberOfLines={1}
                                placeholderTextColor={'#CCCCCC'}
                                placeholder={strNotNull(amount) ? '' : '输入提现金额'}
                                clearTextOnFocus={true}
                                underlineColorAndroid={'transparent'}
                                value={amount}
                                onChangeText={txt => {
                                    let show = prompt_show;
                                    if (Number.parseFloat(txt) > Number.parseFloat(total_account)) {
                                        show = true;
                                    } else {
                                        show = false;

                                    }
                                    this.setState({
                                        prompt_show: show,
                                        amount: txt
                                    })
                                }}

                            />
                        </View>
                        <TouchableOpacity style={styles.view_can} onPress={() => {
                            this.setState({
                                amount: total_account
                            })
                        }}>
                            <Text style={styles.can_money}>{`可提现￥${total_account}元`}</Text>
                            <Text style={styles.all_get}>全部提现</Text>
                        </TouchableOpacity>
                    </View>




                <View style={styles.view_desc}>
                    <Text
                        style={[styles.lb_around, {color: prompt_show ? '#E54A2E' : '#CCCCCC'}]}>{prompt_show ? '金额超出可提现金额' : '最低提现50元，最高提现¥1000元'}</Text>
                </View>

                <View style={styles.card3}>
                    <TouchableOpacity style={styles.item_way} onPress={() => {
                        this.popAction && this.popAction.toggle();
                    }}>
                        <Text style={styles.txt_withdraw}>提现方式</Text>
                        <View style={{flex: 1}}/>
                        <Text
                            style={[styles.txt_pay, {
                                marginRight: 12,
                                color: '#444444',
                                fontWeight: 'normal'
                            }]}>{way}</Text>
                        <Image style={styles.right}
                               source={Images.adr_right}/>
                    </TouchableOpacity>

                    {way === '银行卡' ? <View style={{flexDirection: 'column', marginTop: 34}}>
                        <Text style={styles.txt_pay}>开户行</Text>

                        <View style={styles.view_pay}>
                            <TextInput
                                key={way}
                                style={{
                                    width: 300,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: '#444444'
                                }}
                                maxLength={10}
                                numberOfLines={1}
                                placeholderTextColor={'#CCCCCC'}
                                placeholder={ '填写银行开户行'}
                                underlineColorAndroid={'transparent'}
                                onChangeText={txt => {
                                    this.bank=txt
                                }}

                            />
                        </View>
                    </View> : null}

                    <Text style={[styles.txt_pay, {marginTop: way === '银行卡' ? 13 : 34}]}>{way}号</Text>

                    <View style={styles.view_pay}>
                        <TextInput
                            key={way}
                            style={{
                                width: 300,
                                paddingTop: 0,
                                paddingBottom: 0,
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#444444'
                            }}
                            maxLength={25}
                            numberOfLines={1}
                            placeholderTextColor={'#CCCCCC'}
                            placeholder={strNotNull(account_number) ? '' : `填写${way}号`}
                            underlineColorAndroid={'transparent'}
                            value={account_number}
                            onChangeText={txt => {
                                this.setState({
                                    account_number: txt
                                })
                            }}

                        />
                    </View>

                    <Text style={[styles.txt_pay, {marginTop: 13}]}>真实姓名</Text>

                    <View style={styles.view_pay}>
                        <TextInput
                            key={way}
                            style={{
                                width: 300,
                                paddingTop: 0,
                                paddingBottom: 0,
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#444444'
                            }}
                            maxLength={20}
                            numberOfLines={1}
                            placeholderTextColor={'#CCCCCC'}
                            placeholder={`填写真实姓名`}
                            underlineColorAndroid={'transparent'}
                            onChangeText={txt => {
                                this.name=txt
                            }}

                        />
                    </View>

                    <TouchableOpacity style={styles.btn_cash} onPress={() => {
                        this._check()
                    }}>

                        <Text style={styles.txt_cash}>立即提现</Text>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
        </ScrollView>

            <PopAction
                ref={ref => this.popAction = ref}
                btnArray={this.popActions()}/>

        </BaseComponent>
    }

    _check = () => {
        console.log("进入提现判断",this.state)
        const {way, amount, prompt_show, account_type, account_number} = this.state;
        const {total_account} = this.props.params;
        if (!strNotNull(total_account) || total_account === '0.0' || Number.parseFloat(amount) < 50) {
            showToast("提现金额不足")
        } else if (Number.parseFloat(amount) > 1000) {
            showToast("提现金额超额")
        } else if (!strNotNull(amount) || Number.parseFloat(amount) <= 0) {
            showToast("请输入正确的金额数")
        } else if (way === '银行卡' && (!strNotNull(this.bank.trim()) || !strNotNull(account_number.trim()) || !strNotNull(this.name.trim()))) {
            showToast("请填写完整信息")
        } else if (!strNotNull(account_number.trim()) || !strNotNull(this.name.trim())) {
            showToast("请填写完整信息");
        } else {
            let body = {
                amount: amount,
                real_name: this.name,
                account_type: account_type,
                account: account_number,
                account_memo: this.bank
            }
            console.log("提现：", body)
            alertOrder("确认提现？", () => {
                postWithdrawal(body, data => {
                    showToast("提现申请成功");
                    this.props.params.refresh();
                    router.pop();
                }, err => {
                    showToast(err)
                })
            });

        }

    };

    report = (data) => {
        this.setState({
            way: data.name,
            bank: '',
            account_number: '',
            name: '',
            account_type: data.account_type
        })
        this.popAction && this.popAction.toggle()
    };

    //弹窗
    popActions = () => {
        let resultArray = [];
        list.forEach((data, index) => {
            let item = {name: data.name, txtStyle: {color: '#444444'}, onPress: () => this.report(data)};
            resultArray.push(item);
        });
        // resultArray.push({
        //     name: I18n.t('cancel'),
        //     txtStyle: {color: Colors._AAA},
        //     onPress: () => this.popAction.toggle()
        // });

        return resultArray;
    };

}