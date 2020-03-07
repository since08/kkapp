/**
 * wallet.style.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/7/12.
 *
 */

import {
    StyleSheet,
} from 'react-native';
import {Images, Colors, Metrics, ApplicationStyles} from '../../Themes';

export default StyleSheet.create({
    my_amount: {
        height: 82,
        width: Metrics.screenWidth,
        paddingLeft: 18
    },
    lb_amount: {
        fontSize: 12,
        color: Colors.txt_444,
        marginTop: 12
    },
    txt_amount: {
        fontSize: 28,
        color: Colors.txt_444,
        marginTop: 8
    },
    card: {
        backgroundColor: 'white',
        alignItems: 'center'
    },
    wallet_item: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        width: Metrics.screenWidth - 34,
        borderTopColor: Colors._ECE,
        borderTopWidth: 1
    },
    right: {
        height: 18.5,
        width: 10
    },
    txt_item_name: {
        fontSize: 14,
        color: Colors.txt_444
    },
    card2: {
        backgroundColor: 'white',
        paddingLeft: 17,
        paddingTop: 14
    },
    txt_withdraw: {
        fontSize: 18,
        color: Colors.txt_444,
        fontWeight: 'bold'
    },
    item_input: {
        height: 50,
        width: Metrics.screenWidth - 34,
        borderBottomColor: Colors._ECE,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24
    },
    money: {
        fontSize: 20,
        color: Colors.txt_444,
        fontWeight: 'bold'
    },
    can_money: {
        fontSize: 12,
        color: Colors._AAA,
    },
    view_can: {
        height: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    all_get: {
        fontSize: 12,
        color: '#4A90E2',
        marginRight: 17
    },
    view_desc: {
        height: 62,
        width: '100%',
        paddingTop: 11,
        paddingLeft: 17
    },
    lb_around: {
        fontSize: 12,
        color: Colors._CCC
    },
    card3: {
        backgroundColor: 'white',
        paddingLeft: 17,
        flex: 1
    },
    item_way: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: Metrics.screenWidth - 34,
        borderBottomColor: Colors._ECE,
        borderBottomWidth: 1,
    },
    txt_pay: {
        fontSize: 14,
        color: Colors.txt_444,
        fontWeight:'bold'
    },
    view_pay: {
        height: 30,
        width: Metrics.screenWidth - 34,
        borderBottomColor: Colors._ECE,
        borderBottomWidth: 1,
        marginTop: 10
    },
    btn_cash: {
        height: 44,
        width: Metrics.screenWidth - 34,
        backgroundColor: '#E54A2E',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderRadius:2
    },
    txt_cash: {
        color: 'white',
        fontSize: 14
    },
    invite_view:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:17,marginRight:17
    },
    botton_view:{
        paddingTop:11,
        paddingBottom:11,
        paddingLeft:45,paddingRight:45,
        borderRadius:3,
        justifyContent:'center',
        alignItems:'center'
    },
    view33:{
        flexDirection:'column',
        alignItems:'center'
    },
    txt44:{
        color:'#444444',
        fontSize:26,
        fontWeight:'bold'
    },
    txt55:{
        color:'#888888',
        fontSize:12
    },
    pageItem:{
        flexDirection:'row',
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10,
        marginRight:17,
        marginLeft:17,
        borderBottomWidth:1,
        borderBottomColor:'#F3F3F3'

    },
    txt_num:{
        color:Colors._666,
        fontSize:15,
        fontWeight:'bold'
    },
    avatar:{
        height:50,
        width:50,
        borderRadius:25,
        marginRight:15
    },
    txt_name:{
        color:Colors._333,
        fontSize:14,
        fontWeight:'bold',
        marginBottom:2
    },
    txt_decs:{
        color:Colors._AAA,
        fontSize:12
    },
    img_left:{
        height:12,
        width:6,
        marginLeft:8
    }
})