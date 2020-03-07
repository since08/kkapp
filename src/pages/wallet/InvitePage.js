import React, {PureComponent, Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, Modal
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {
    isEmptyObject, mul, div, formatCurrency, strNotNull, sharePage, uShareRegistered,
    shareHost
} from "../../utils/ComonHelper";
import ImageLoad from "../../components/ImageLoad";
import styles from './wallet.style';
import {invite_count, user_invite} from "../../services/WallDao";


export default class InvitePage extends Component {

    state = {
        invites: [],
        invite_count: {},
        user_invite: {},
        visible: false
    };

    componentDidMount() {
        invite_count(data => {
            console.log('总的邀请数和邀请奖励', data);

            this.setState({invite_count: data})
        })

        user_invite({page:1,page_size:4},data => {
            console.log('我的邀请好友', data);

            this.setState({user_invite: data})
        })
    };


    _renderItem = ({item, index}) => {
        const {user_invite} = this.state;
        const {avatar, mobile, nick_name, signature, user_id} = item;
        if (index <= 3) {
            return (
                <TouchableOpacity style={styles.pageItem}
                                  onPress={() => {
                                      if (user_invite.next_step) {
                                          global.router.toOtherInvitePage(item)
                                      }
                                  }}>


                    <ImageLoad style={styles.avatar}
                               source={{uri: avatar}}/>

                    <View style={{width: '50%'}}>
                        <Text style={styles.txt_name}>{nick_name}</Text>
                    </View>

                    <View style={{flex: 1}}/>

                    <Text style={styles.txt_decs}>他的邀请</Text>

                    <Image style={styles.img_left}
                           source={Images.adr_right}/>

                </TouchableOpacity>
            )
        }

    };


    render() {
        const {user_invite, invite_count, showQRCode} = this.state;
        const {total_invite_number, total_invite_money} = invite_count;
        return (<View style={[ApplicationStyles.bgContainer, {backgroundColor: 'white'}]}>
                <ScrollView>
                    <ImageBackground style={{width: Metrics.screenWidth, height: 284}} source={Images.wallet.bg}>
                        <NavigationBar

                            title=""
                            leftBtnIcon={Images.sign_return}
                            leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                            leftBtnPress={() => router.pop()}
                            rightBtnIcon={Images.wallet.rule2}
                            rightBtnPress={() => {
                                global.router.toInviteRulePage()
                            }}/>
                    </ImageBackground>


                    <View style={{
                        backgroundColor: 'white',
                        paddingTop: 28,
                        paddingBottom: 12,
                        flexDirection: 'column',
                        justifyContent: 'space-around'
                    }}>
                        <View style={[styles.invite_view]}>
                            <TouchableOpacity style={[styles.botton_view, {
                                backgroundColor: '#E54A2E',
                                borderWidth: 1,
                                borderColor: '#E54A2E'
                            }]}
                                              onPress={() => {
                                                  uShareRegistered();
                                              }}>
                                <Text style={{color: "white", fontSize: 14}}>立即邀请</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={[styles.botton_view, {
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: '#E54A2E'
                            }]} onPress={() => {
                                this.toggle();
                            }}>
                                <Text style={{color: "#E54A2E", fontSize: 14}}>二维码邀请</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.invite_view, {marginTop: 31}]}>
                            <Image style={{width: 20, height: 20}} source={Images.wallet.moneys}/>
                            <Text style={{color: '#444444', fontSize: 15, marginLeft: 8}}>邀请奖励</Text>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                                global.router.toAwardDetailPage()
                            }}>
                                <Text style={{color: '#888888', fontSize: 12, marginLeft: 8}}>查看明细</Text>
                                <Image source={Images.adr_right} style={{height: 14, width: 7, marginLeft: 5}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.invite_view, {marginLeft: 58, marginRight: 58, marginTop: 24}]}>
                            <View style={styles.view33}>
                                <Text style={styles.txt44}>{total_invite_money}元</Text>
                                <Text style={styles.txt55}>累计赚取</Text>
                            </View>
                            <Image source={Images.wallet.dddd}
                                   style={{height: 39, width: 3, marginLeft: 49, marginRight: 49}}/>
                            <View style={styles.view33}>
                                <Text style={styles.txt44}>{total_invite_number}人</Text>
                                <Text style={styles.txt55}>成功邀请</Text>
                            </View>
                        </View>


                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 17,
                        paddingLeft: 17,
                        paddingRight: 17,
                        paddingBottom: 6,
                        backgroundColor: 'white'
                    }}>
                        <Image style={{width: 23, height: 20, marginRight: 6}} source={Images.wallet.friends}/>
                        <Text style={{color: "#000000", fontSize: 14}}>
                            我邀请的好友
                        </Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                          onPress={() => {
                                              global.router.toUserInvitePage(user_invite)
                                          }}>
                            <Text style={{color: '#888888', fontSize: 12, marginLeft: 8}}>更多好友</Text>
                            <Image source={Images.adr_right} style={{height: 14, width: 7, marginLeft: 5}}/>
                        </TouchableOpacity>
                    </View>

                    {isEmptyObject(user_invite) || isEmptyObject(user_invite.items) ? null : <FlatList
                        style={{flex: 1, paddingBottom: 50, backgroundColor: 'white'}}
                        data={user_invite.items}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => `comment${index}`}
                    />}


                </ScrollView>
                {this.state.visible ? <TouchableOpacity
                    activeopacity={1}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        height: Metrics.screenHeight,
                        width: Metrics.screenWidth
                    }}
                    onPress={() => {
                        this.toggle()
                    }}>
                    <View style={{width: 210, height: 210, borderWidth: 8, borderColor: 'white',alignItems:'center',justifyContent:'center'}}>
                      
                    </View>

                </TouchableOpacity> : null}
            </View>

        )
    }

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    getUserId = () => {
        if (!isEmptyObject(global.login_user) && strNotNull(global.login_user.user_id)) {
            return login_user.user_id;
        }
        return '0';
    }

}

