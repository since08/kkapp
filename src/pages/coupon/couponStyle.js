import {StyleSheet} from 'react-native'
import {Colors, Metrics} from "../../Themes";

export default StyleSheet.create({
    sameView:{
        flexDirection:'row',
        alignItems:'center'
    },
    itemView:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:15,
        marginBottom:13,
        marginLeft:23,
        marginRight:18
    },
    itemLeft:{
        flexDirection:'column'
    },
    txt1:{
        color:"#AAAAAA",
        fontSize:12
    },
    touchView:{
        width:81,
        height:32,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:16,
        marginTop:7


    },
    nav: {
        height: Metrics.navBarHeight,
        width: '100%',
        backgroundColor: Colors._E54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Metrics.statusBarHeight
    },
    cancel: {
        fontSize: 14,
        color: Colors.white
    },
    title: {
        fontSize: 18,
        color: Colors.white
    },
    btn_search: {
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    View: {
        marginTop: 7,
        width: '100%'
    },
    info_item:{
        marginLeft:17,
        paddingTop:17,
        paddingBottom:17,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:"#F3F3F3"
    },
    text22:{
        width:90,
        color:'#444444',
        fontSize:14
    },
    text23:{
        color:'#AAAAAA',
        fontSize:14,
        marginRight:17,
        width:'70%'
    },
    sameView2:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:17,marginRight:17,
        marginTop:11
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