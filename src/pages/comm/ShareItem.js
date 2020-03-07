import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import JShareModule from "jshare-react-native";
import {postCancelFavorites, postFavorites} from '../../services/MacauDao';

const DEVICE_WIDTH = Dimensions.get('window').width;
import {
    Lang, strNotNull, showToast, isEmptyObject, logMsg, util, deleteProductFromCart,
    isFavorite
} from '../../utils/ComonHelper';
import fs from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {postShareCount} from "../../services/AccountDao";


export default class ShareItem extends Component {

    static props = {
        item: null,//分享平台
        itemClick: null,//分享事件
        shareTitle: null,//分享标题
        shareText: null,//分享内容
        shareLink: null,//分享链接
        shareImage: null,//分享图片
        shareId: null,//分享的ID
        shareType: null,//分享的类型
    };


    //分享
    shareAction = async () => {
        let item = this.props.item;
        //是否允许分享
        let isAllowShare = true;

        let platform = item.platform;
        if (platform === "wechat_session" || platform === "wechat_timeLine") {
            //检查是否安装微信客户端
            JShareModule.isWeChatInstalled((isInstalled) => {
                if (isInstalled !== true) {
                    isAllowShare = false;
                    showToast("未安装微信客户端");
                }
            });
        }
        else if (platform === "qq") {
            JShareModule.isQQInstalled((isInstalled) => {
                if (isInstalled !== true) {
                    isAllowShare = false;
                    showToast("未安装QQ客户端");
                }
            });
        }
        else if (platform === "favorites") {
            if (isEmptyObject(global.login_user)){
                global.router.toLoginFirstPage()
            }else{
                let body = {
                    target_id: this.props.shareId,
                    target_type: this.props.shareType
                };
                let can = isFavorite(body)
                logMsg("收藏进来了",can)
                if(can){
                    postCancelFavorites(body, data => {
                        logMsg("取消收藏成功", data)
                        showToast("取消收藏");
                    },err=>{
                        logMsg("取消收藏失败",err)
                        showToast("取消收藏失败")
                    })
                }else{
                    postFavorites(body, data => {
                        logMsg("收藏成功", data)
                        showToast("收藏成功")
                    },err=>{
                        logMsg("收藏失败",err)
                        showToast("已收藏")
                    })
                }

            }

        }


        if (isAllowShare) {

            let rootPath = fs.DocumentDirectoryPath;
            let unix = new Date() / 1000;
            let savePath = rootPath + `/${unix}temp_share.jpg`;

            console.log(this.props.shareImage);


            if (strNotNull(this.props.shareImage)) {
                fs.downloadFile({
                    fromUrl: this.props.shareImage,
                    toFile: savePath
                }).promise.then(resp => {
                    if (resp.statusCode === 200) {
                        if (Platform.OS === 'ios') {
                            ImageResizer
                                .createResizedImage(savePath, 100, 100, 'JPEG', 0.7)
                                .then((response) => {
                                    this.shareUrl(item.platform, response.path)
                                }).catch((err) => {
                                console.log('ImageResizer错误', err)
                            });
                        } else {
                            this.shareUrl(item.platform, savePath)
                        }


                    }
                });
            } else {
                if(platform !== "favorites")
                this.shareUrl(item.platform, '')
            }


        }


    };

    // shareUrl = (platform, imagePath) => {
    //     let message = {
    //         platform: platform,
    //         type: "link",
    //         url: this.props.shareLink,
    //         title: this.props.shareTitle,
    //         text: this.props.shareText,
    //         imagePath: imagePath,
    //     };
    //     console.log('分享参数', message);
    //     if (Platform.OS === 'android' && platform === 'wechat_timeLine') {
    //         WeChat.shareToTimeline({
    //             thumbImage: "file://" + imagePath,
    //             type: 'news',
    //             webpageUrl: this.props.shareLink,
    //             description: this.props.shareText,
    //             title: this.props.shareTitle
    //         }).then(data => {
    //             console.log('分享成功', data);
    //             this._share_success()
    //         }).catch(err => {
    //             console.log('分享失败', err);
    //         })
    //     } else if (Platform.OS === 'android' && platform === 'wechat_session') {
    //         WeChat.shareToSession({
    //             thumbImage: "file://" + imagePath,
    //             type: 'news',
    //             webpageUrl: this.props.shareLink,
    //             description: this.props.shareText,
    //             title: this.props.shareTitle
    //         }).then(data => {
    //             console.log('分享成功', data);
    //             this._share_success()
    //
    //         }).catch(err => {
    //             console.log('分享失败', err);
    //         })
    //     } else {
    //         JShareModule.share(message, (map) => {
    //             console.log('分享成功', map);
    //             this._share_success()
    //         }, (map) => {
    //             console.log('分享失败', map);
    //         });
    //
    //     }
    //
    //     if (this.props.itemClick === null) return;
    //     this.props.itemClick();
    // };
    shareUrl = (platform, imagePath) => {
        let message = {
            platform: platform,
            type: "link",
            url: this.props.shareLink,
            title: this.props.shareTitle,
            text: this.props.shareText,
            imagePath: imagePath,
        };
        console.log('分享参数', message);

        JShareModule.share(message, (map) => {
            console.log('分享成功', map);

        }, (map) => {
            console.log('分享失败', map);
        });
        this._share_success()
        if (this.props.itemClick === null) return;
        this.props.itemClick();
    };

    _share_success = () => {
        if (this.props.shareClick) {
            this.props.shareClick()
        } else {
            if (!isEmptyObject(global.login_user))
                postShareCount({}, data => {
                    console.log("用户推荐好友分享成功:")
                }, err => {

                })
        }

    }


    render() {
        const {item} = this.props;
        return (
            <TouchableOpacity onPress={this.shareAction}>
                <View style={styles.container}>
                    <View style={styles.subView}>
                        <View style={styles.imageSuper}>
                            <Image style={styles.image} source={item.icon}/>
                        </View>
                        <Text style={styles.text}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: (DEVICE_WIDTH - 40) / 4,
        height: (DEVICE_WIDTH - 40) / 4,
        alignItems: "center",
        justifyContent: "center",
    },
    subView: {
        width: (DEVICE_WIDTH - 90) / 4,
        height: (DEVICE_WIDTH - 90) / 4,
        alignItems: "center",
        justifyContent: "center",
    },
    imageSuper: {
        width: (DEVICE_WIDTH - 140) / 4,
        height: (DEVICE_WIDTH - 140) / 4,
        backgroundColor: "white",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 40,
        height: 40,
    },
    text: {
        marginTop: 10,
        fontSize: 15,
    }
});