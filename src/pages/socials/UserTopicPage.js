import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Platform,
    findNodeHandle
} from 'react-native';
import {Images, ApplicationStyles, Metrics, Colors} from "../../Themes";
import I18n from '../../I18n/I18n';
import {NavigationBar} from '../../components';
import PersonDynamicPage from '../comment/PersonDynamicPage'
import {visit_other, follow, profile, report_user} from '../../services/SocialDao';
import _ from 'lodash';
import Loading from "../../components/Loading";
import {isFollowed, showToast, isEmptyObject} from '../../utils/ComonHelper';
import PopAction from '../comm/PopAction';
import ImageLoad from "../../components/ImageLoad";
import {getJmessageInfo} from '../../services/AccountDao'

const HeadHeight = Platform.OS === 'ios' ? Metrics.iPhone_X ? 300 : 280 : 260

const styles = StyleSheet.create({
    topBar: {
        width: Metrics.screenWidth,
        alignItems: 'center',
        backgroundColor: Colors._E54,
        height: HeadHeight
    },
    person1: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 6
    },
    follow: {
        color: Colors._CCC,
        fontSize: 14
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        height: 12, width: 1, backgroundColor: '#979797',
        marginLeft: 9, marginRight: 9
    },
    intro: {
        fontSize: 12,
        color: Colors._AAA,
        marginTop: 7
    },
    btn_follow: {
        height: 28,
        width: 120,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#979797',
        alignItems: 'center',
        justifyContent: 'center'
    },
    go_top: {
        position: 'absolute',
        right: 17,
        bottom: 50,
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: Colors._E54,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blur: {position: 'absolute', height: HeadHeight, width: '100%'}
})

export default class UserTopicPage extends PureComponent {

    state = {
        scrollEnabled: false,
        follow: isFollowed(this.props.params.userInfo.user_id),
        user: {},
        viewRef: null
    };

    componentDidMount() {
        profile(this.props.params.userInfo.user_id, data => {
            this.setState({
                user: data
            })
        }, err => {
        })
    }

    //私信
    visitChat = () => {
        ///未登录先登录
        if (login_user.user_id === undefined) {
            router.toLoginFirstPage();
            return;
        }
        if (isEmptyObject(global.imUser)) {
            getJmessageInfo(() => {
                this.getImUser()
            })
        } else {
            this.getImUser()
        }

    };

    getImUser = () => {
        this.loading && this.loading.open();

        const {nick_name, user_id} = this.props.params.userInfo;
        ///获取私信用户的用户名
        visit_other({userId: user_id}, (user) => {

            this.loading && this.loading.close();
            router.toMessageList({
                username: user.username,
                nickname: user.nickname,
                avatarThumbPath: user.avatar,
            });
        }, (error) => {
            showToast(I18n.t("error_alert"));
            this.loading && this.loading.close();
        });
    }

    _onScroll = (e) => {
        let scrollY = e.nativeEvent.contentOffset.y;

        this.setState({
            scrollEnabled: scrollY > 250
        });
        if (scrollY > 260) {
            this.scroll && this.scroll.scrollTo({x: 0, y: HeadHeight, animated: false})
        }
    };


    imageLoaded = () => {
        this.setState({viewRef: findNodeHandle(this.backgroundImage)});
    }

    _renderHead = () => {
        let props = Platform.OS === 'ios' ? {
            blurAmount: 18
        } : {
            downsampleFactor: 10,
            overlayColor: 'rgba(255,255,255,.4)'
        };
        const {following_count, followers_count, avatar, nick_name, signature, user_id} = this.state.user;
        return <View style={styles.topBar}>
            <Image
                ref={(img) => {
                    this.backgroundImage = img;
                }}
                onLoadEnd={this.imageLoaded}
                style={styles.blur}
                source={Images.social.user_topic}/>

            <NavigationBar
                barStyle={'light-content'}
                rightBtnIcon={Images.social.more_4}
                rightImageStyle={{height: 4, width: 20, marginLeft: 20, marginRight: 20}}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}
                rightBtnPress={() => {
                    this.popAction && this.popAction.toggle();
                }}/>
            <View
                style={styles.person1}>
                <ImageLoad
                    emptyBg={Images.home_avatar}
                    style={{width: 72, height: 72, borderRadius: 36}}
                    source={{uri: avatar}}/>
            </View>

            <Text style={[styles.name,{marginLeft:17,marginRight:17}]}>{nick_name}</Text>

            <View style={[styles.row, {marginTop: 7,marginLeft:17,marginRight:17}]}>
                <Text style={styles.follow}>{`${I18n.t('social.follow')} ${following_count}`}</Text>
                <View style={styles.line}/>
                <Text style={styles.follow}>{`${I18n.t('stalwart')} ${followers_count}`}</Text>
            </View>

            <Text
                numberOfLines={1}
                style={[styles.intro,{marginLeft:17,marginRight:17}]}>{_.isEmpty(signature) ? '简介：这家伙很懒' : signature}</Text>


            <View style={[styles.row, {marginTop: 17, marginBottom: 17}]}>
                <TouchableOpacity
                    onPress={() => {
                        follow(this.state.follow, {target_id: user_id}, data => {
                            this.setState({
                                follow: !this.state.follow
                            })
                        }, err => {
                        })
                    }}
                    style={[styles.btn_follow, {marginRight: 26}]}>
                    <Text
                        style={styles.follow}>{this.state.follow ? I18n.t('rank_focused') : I18n.t('rank_focus')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn_follow, styles.row]} onPress={() => this.visitChat()}>
                    <Image style={{height: 14, width: 15, marginRight: 3}}
                           source={Images.social.reply}
                    />
                    <Text style={styles.follow}>{I18n.t('social.message')}</Text>
                </TouchableOpacity>
            </View>


        </View>
    };

    scrollTop = () => {
        this.scroll && this.scroll.scrollTo({x: 0, y: 0, animated: false})
    }


    goTopView = () => {
        return <TouchableOpacity
            onPress={this.scrollTop}
            style={styles.go_top}>
            <Text style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: Colors.white
            }}>TOP</Text>

        </TouchableOpacity>
    }

    //弹窗
    popActions = () => {
        let reportList = global.reportList;
        let resultArray = [];
        reportList.forEach((data, index) => {
            let item = {name: data.name, txtStyle: {color: '#4A90E2'}, onPress: () => this.report(index)};
            resultArray.push(item);
        });
        resultArray.push({
            name: I18n.t('cancel'),
            txtStyle: {color: Colors._AAA},
            onPress: () => this.popAction.toggle()
        });

        return resultArray;
    };

    //举报
    report = (index) => {
        const {user_id} = this.props.params.userInfo;
        let reportList = global.reportList;
        let data = reportList[index];
        let body = {
            "target_id": user_id,
            "body": data.name,
            "target_type": "user"
        };
        report_user(body, (ret) => {
            showToast(I18n.t("report_success"));
        }, (err) => {
            console.log(err);
        });
        this.popAction && this.popAction.toggle();
    };

    render() {

        if (Platform.OS === 'ios')
            return <ScrollView
                ref={ref => this.scroll = ref}
                scrollEventThrottle={10}
                onScroll={this._onScroll}>

                {this._renderHead()}
                <View style={{height: Metrics.screenHeight}}>
                    <PersonDynamicPage
                        scrollTop={this.scrollTop}
                        scrollEnabled={this.state.scrollEnabled}
                        params={this.props.params}/>
                </View>

                {this.goTopView()}
                <Loading ref={ref => this.loading = ref} cancelable={true}/>
                <PopAction
                    ref={ref => this.popAction = ref}
                    btnArray={this.popActions()}/>
            </ScrollView>
        else
            return <ScrollView
                scrollEventThrottle={10}
                ref={ref => this.scroll = ref}
                scrollEnabled={!this.state.scrollEnabled}
                onScroll={this._onScroll}>


                {this._renderHead()}
                <View style={{height: Metrics.screenHeight - 20}}>
                    <PersonDynamicPage
                        scrollTop={this.scrollTop}
                        params={this.props.params}/>
                </View>

                {this.goTopView()}
                <Loading ref={ref => this.loading = ref} cancelable={true}/>
                <PopAction
                    ref={ref => this.popAction = ref}
                    btnArray={this.popActions()}/>
            </ScrollView>


    }
}