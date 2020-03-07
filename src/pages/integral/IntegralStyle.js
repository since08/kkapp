import {StyleSheet} from 'react-native'
import {Colors, Metrics} from "../../Themes";

export default StyleSheet.create({
    sort: {
        height: 40,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    listItem: {
        height: 208,
        width: '49%',
        backgroundColor: 'white',
        marginTop: 5,
        flexDirection:'column'
    },
    btn_search: {
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_click: {
        marginRight: 17,
        color: '#FFFFFF', fontSize: 14
    },
    nav: {
        height: Metrics.navBarHeight,
        width: '100%',
        backgroundColor: Colors._E54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Metrics.statusBarHeight
    },
    title: {
        fontSize: 18,
        color: Colors.white
    },
    couponImg:{
        width:151,
        height:91,
        marginTop:26
    },
    marginS:{
        marginLeft:17,
        marginRight:17
    },
    TXt:{
        color:"#444444",
        fontSize:16
    },
    TXt2:{
        color:"#AAAAAA",
        fontSize:12,
        marginTop:1
    },
    TXt3:{
        color:"#E54A2E",
        fontSize:14
    },
    TXt4:{
        color:"#444444",
        fontSize:14
    },
    infoPage:{
        backgroundColor:'white',
        flexDirection:'column'
    },
    Txt5:{
        color:'#666666',
        fontSize:14,
        lineHeight:20
    },
    infoBottom:{
        width:'100%',
        paddingTop:16,
        paddingBottom:13,
        alignItems:'center',
        justifyContent:'center',
        bottom: 0
    }

})
