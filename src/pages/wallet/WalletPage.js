/**
 * WalletPage.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/7/12.
 *
 */

import React, {Component} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text, Image,
    View,
} from 'react-native';
import {Images, Colors, Metrics} from '../../Themes';
import styles from './wallet.style'
import {BaseComponent, NavigationBar} from '../../components'
import {wallet_account} from "../../services/WallDao";
import {moneyFormat} from "../../utils/ComonHelper";

export default class WalletPage extends Component {

    state = {
        total_account: 0
    }

    items = [
        {
            icon: Images.wallet.record, name: '交易记录', type: 0,
            style: {height: 24, width: 22, marginRight: 16}
        },
        // {
        //     icon: Images.wallet.card, name: '银行卡绑定', type: 1,
        //     style: {height: 22, width: 30, marginRight: 8}
        // },
        {
            icon: Images.wallet.get_cash, name: '提现', type: 2,
            style: {height: 26, width: 27, marginRight: 11}
        }
    ]



    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        wallet_account(data => {
            console.log("钱包", data)
            this.setState({
                total_account: data.total_account
            })
        }, err => {

        });
        this.props.params.refresh();
    };

    render() {

        return <BaseComponent>
            <NavigationBar title={'我的钱包'}
                           titleStyle={{fontSize: 17, color: Colors._161817}}
                           toolbarStyle={{backgroundColor: Colors._FFF}}
                           leftBtnIcon={Images.coupon.return_hei}
                           leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                           leftBtnPress={() => {
                               router.pop();
                               this.props.params.refresh()
                           }}/>

            <View style={styles.card}>
                <View style={styles.my_amount}>
                    <Text style={styles.lb_amount}>账户余额（元）</Text>
                    <Text style={styles.txt_amount}>{this.state.total_account}</Text>
                </View>


                {this.items.map(item => {
                    return <TouchableOpacity
                        key={item.type}
                        style={styles.wallet_item}
                        onPress={() => {
                            if (item.type === 0) {
                                router.toWalletDetailsPage()
                            }
                            if (item.type === 2) {
                                router.toWithdraw(this.state.total_account,this.refresh)
                            }
                        }}
                    >
                        <Image
                            source={item.icon}
                            style={item.style}/>

                        <Text style={styles.txt_item_name}>{item.name}</Text>
                        <View style={{flex: 1}}/>
                        <Image style={styles.right}
                               source={Images.adr_right}/>
                    </TouchableOpacity>
                })}


            </View>


        </BaseComponent>
    }
}