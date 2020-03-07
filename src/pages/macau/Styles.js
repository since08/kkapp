import { StyleSheet } from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';

export default StyleSheet.create({
    pageItem:{
        flexDirection:'row',
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10,
        marginRight:17,
        marginLeft:22,
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
        marginRight:15,
        marginLeft:24
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