import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, InteractionManager
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {logMsg, strNotNull, util} from '../../utils/ComonHelper';
import styles from './fastStyles';

const txt1 = '从深圳过境至澳门主要的交通方式就是乘船过境，在购买船票过境前，首先得确保自身的港澳同行证及身份证仍在有效期内，船票采用实名制购买，以上两证请随身携带以防遗漏。购票时间则建议最好在过境当日的前1~3日进行预定，避免出现临时订票没空位的情况。'
const txt2 = '游客可以乘坐深圳地铁 2号线（蛇口线）至 蛇口港地铁站，并从蛇口港C出口出去，转乘328/M105等公交（1个站，约15分钟）到达新招商蛇口邮轮码头； 从蛇口港地铁站到蛇口邮轮中心，全程约2.3公里，预计10分钟能到。 '

const round1 = 'http://kkh5.deshpro.com/images/fastBtn/round1.jpeg';
const round2 = 'http://kkh5.deshpro.com/images/fastBtn/round2.jpeg';
const round3 = 'http://kkh5.deshpro.com/images/fastBtn/round3.jpeg';
const round4 = 'http://kkh5.deshpro.com/images/fastBtn/round4.jpeg';
const round5 = 'http://kkh5.deshpro.com/images/fastBtn/round5.jpeg';
const round6 = 'http://kkh5.deshpro.com/images/fastBtn/round6.jpeg';

export default class RoundTripPage extends Component {

    imageClick = (source) => {
        if (!util.isEmpty(source)) {
            let index = 0;

            let images = [{url: source}];

            router.toImageGalleryPage(images, index)
        }

    };

    render() {
        return (
            <View style={ApplicationStyles.bgContainer}>
                <NavigationBar
                    title={'邮轮往返指南'}
                    toolbarStyle={{
                        backgroundColor: Colors._E54
                    }}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}
                />

                <ScrollView style={{flex: 1}}>

                    <View style={{marginLeft: 17, marginRight: 17, paddingBottom: 40}}>
                        <Text style={[styles.txt1, {marginTop: 15}]}>一、过境准备</Text>
                        <Text style={[styles.txt2, {marginTop: 6}]}>{txt1}</Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round1);
                        }}>
                            <Image style={{width: '100%', height: 230, marginTop: 6, alignSelf: 'center'}}
                                   source={Images.fastBtn.round1}/>
                        </TouchableOpacity>
                        <Text style={[styles.txt1, {marginTop: 17}]}>二、船票购票流程 </Text>
                        <Text style={[styles.txt3, {marginTop: 4}]}>*目前蛇口邮轮的订购方式主要为现场自主买票及微信预定 </Text>
                        <Text style={[styles.txt2, {marginTop: 6}]}>1、微信搜索「招商蛇口邮轮码头」，点击关注并进入微信公众号 </Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round5);
                        }}>
                            <Image style={{width: 140, height: 250, marginTop: 11, alignSelf: 'center'}}
                                   source={Images.fastBtn.round5}/>
                        </TouchableOpacity>

                        <Text style={[styles.txt2, {marginTop: 21}]}>2、点击主菜单下的「一键预定」，并选择“高速客船”进行船票预订 </Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round3);
                        }}>
                            <Image style={{width: 160, height: 280, marginTop: 20, alignSelf: 'center'}}
                                   source={Images.fastBtn.round3}/>
                        </TouchableOpacity>

                        <Text style={[styles.txt2, {marginTop: 17}]}>3、进入邮轮母港购票页面，选择行程、时间及到达港口等信息后进行确认购票 </Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round4);
                        }}>
                            <Image style={{width: 160, height: 286, marginTop: 14, alignSelf: 'center'}}
                                   source={Images.fastBtn.round4}/>
                        </TouchableOpacity>

                        <Text style={[styles.txt2, {marginTop: 14}]}>目前深圳到澳门路线共有两条： </Text>
                        <Text style={[styles.txt2, {marginTop: 7}]}>①深圳蛇口⇌澳门氹仔 ②深圳蛇口⇌澳门外港 </Text>
                        <Text
                            style={[styles.txt3, {marginTop: 12}]}>注：蛇口邮轮的行驶时间约为1小时左右，班次间隔平均在1小时/一班上下，具体邮轮班次时间表请见文末。 </Text>
                        <Text style={[styles.txt1, {marginTop: 20}]}>三、邮轮船票领取方式</Text>
                        <Text style={[styles.txt2, {marginTop: 12}]}>购票成功后可以根据船次时间前往招商蛇口邮轮码头，进行取票过境。
                            蛇口邮轮码头在B1、L1、L2均设立了自助取票点，过境旅客可通过携带身份证进行自助取票 </Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round2);
                        }}>
                            <Image style={{width: '100%', height: 229, marginTop: 14, alignSelf: 'center'}}
                                   source={Images.fastBtn.round2}/>
                        </TouchableOpacity>

                        <Text style={[styles.txt1, {marginTop: 18}]}>四、蛇口邮轮码头交通信息 </Text>
                        <Text style={[styles.txt2, {marginTop: 6}]}>{txt2}</Text>
                        <TouchableOpacity onPress={()=>{
                            this.imageClick(round6);
                        }}>
                            <Image style={{width: '100%', height: 280, marginTop: 11, alignSelf: 'center'}}
                                   source={Images.fastBtn.round6}/>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        )
    }
}