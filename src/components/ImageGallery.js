/**
 * Created by lorne on 2017/2/9.
 */
import React from 'react';
import {
    Modal, ActivityIndicator, View, CameraRoll, Platform
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../Themes';
import {logMsg, showToast} from "../utils/ComonHelper";
import RNFS from 'react-native-fs';
import PopAction from '../pages/comm/PopAction';

const storeLocation = `${RNFS.TemporaryDirectoryPath}`;

export default class ImageGallery extends React.Component {

    state = {
        img: ''
    }

//保存图片
    saveImg = (img,popAction) => {
        let path = img.url;
        if (Platform.OS === 'ios') {
            var promise = CameraRoll.saveToCameraRoll(path);
            promise.then(function (result) {
                showToast('保存成功！');
                popAction && popAction.toggle();
            }).catch(function (error) {
                showToast('保存失败！');
                popAction && popAction.toggle();
            });
        } else {
            let filename;
            if (path.indexOf("/") > 0)//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
            {
                filename = path.substring(img.url.lastIndexOf("."), path.length);
            }
            else {
                filename = path;
            }
            logMsg('filename', filename)//获取图片路径后缀
            let pathName = new Date().getTime() + filename;
            let downloadDest = `${storeLocation}/${pathName}`;
            logMsg('downloadDest', downloadDest)
            try {
                const ret = RNFS.downloadFile({fromUrl: path, toFile: downloadDest});
                ret.promise.then(res => {
                    CameraRoll.saveToCameraRoll(downloadDest)
                        .then(() => {
                            showToast('图片已保存到相册');
                            popAction && popAction.toggle();
                        }).catch((res) => {
                        showToast('图片保存失败');
                        logMsg('res,',res)
                        popAction && popAction.toggle();
                    })
                    // console.log("res",res)
                    // showToast('图片已保存到相册')
                    // popAction && popAction.toggle();
                }).catch(err => {
                    showToast('图片保存失败', err)
                    popAction && popAction.toggle();
                    console.log('err', err);
                });
            }
            catch (e) {
                console.log(e);
            }
        }

    };

    popActions = () => {
        return [{name: '保存图片', txtStyle: {color: '#4A90E2'}, onPress: () => this.saveImg(this.state.img,this.popAction)},
            {name: '取消', txtStyle: {color: Colors._AAA}, onPress: () => this.popAction.toggle()}]
    };

    render() {

        const {images, index} = this.props.params;
        return (
            <View style={{flex: 1}}>
                <ImageViewer
                    loadingRender={() => {
                        return <ActivityIndicator
                            color='white'/>
                    }}
                    saveToLocalByLongPress={false}
                    onLongPress={(image) => {
                        this.setState({
                            img: image
                        })
                        this.popAction && this.popAction.toggle();
                        // this.saveImg(image);
                    }}
                    imageUrls={images}
                    index={index}
                    onClick={() => router.pop()}/>

                <PopAction
                    ref={ref => this.popAction = ref}
                    btnArray={this.popActions(images)}/>
            </View>
        )
    }
}