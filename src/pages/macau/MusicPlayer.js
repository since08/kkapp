/**
 * MusicPlayer.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/8/6.
 *
 */

import React, {Component} from 'react';
import {
    View, Platform, AppState
} from 'react-native';
import Sound from 'react-native-sound'
import {getFileName, logMsg} from "../../utils/ComonHelper";

// Sound.setCategory('Playback');

export default class MusicPlayer extends Component {


    downloadMusic = (fromUrlPath) => {


        logMsg('缓存路径', fromUrlPath)
        this.sound = null;
        try {
            this.sound = new Sound(fromUrlPath, '', error => {
                if (error) {
                    logMsg('播放失败：', error)
                    return
                }
                //设置音量为一半
                this.sound.setVolume(0.5)
                //单曲循环 调用stop停止
                this.sound.setNumberOfLoops(-1)
                //播放
                this.sound.play(success => {
                    if (success) {
                        logMsg('播放结束...', fromUrlPath)
                    } else {
                        logMsg('reset 重试')
                        this.sound.reset();
                    }
                })
            })

        } catch (e) {
            logMsg(e)
        }


    }

    pause = () => {
        if (this.sound) {
            if (AppState.currentState === 'active') {
                if (Platform.OS === 'ios') {
                    if (this.sound.isPlaying()) {
                        this.sound && this.sound.pause(msg => {
                            logMsg('pause 暂停播放', msg)
                        })
                    } else {
                        this.sound.play(msg => {
                            logMsg('重新播放')
                        })
                    }

                } else {
                    if (this.props.music) {
                        this.sound && this.sound.pause(msg => {
                            logMsg('pause 暂停播放', msg)
                        })
                    } else {
                        this.sound.play(msg => {
                            logMsg('重新播放')
                        })
                    }
                }

            } else{
                this.sound && this.sound.pause(msg => {
                    logMsg('pause 暂停播放', msg)
                })
            }

            // if (Platform.OS === 'ios') {
            //     if (this.sound.isPlaying()) {
            //         if (AppState.currentState !== 'active') {
            //             this.sound && this.sound.pause(msg => {
            //                 logMsg('pause 暂停播放', msg)
            //             })
            //         } else if (AppState.currentState === 'active') {
            //             if(this.props.music){
            //                 this.sound && this.sound.pause(msg => {
            //                     logMsg('pause 暂停播放', msg)
            //                 })
            //             }else{
            //                 this.sound.play(msg => {
            //                     logMsg('重新播放')
            //                 })
            //             }
            //
            //         }
            //     } else {
            //         this.sound && this.sound.pause(msg => {
            //             logMsg('pause 暂停播放', msg)
            //         })
            //     }
            // } else {
            //     if (this.props.music) {
            //         if (AppState.currentState !== 'active') {
            //             this.sound && this.sound.pause(msg => {
            //                 logMsg('pause 暂停播放', msg)
            //             })
            //         } else if (AppState.currentState === 'active') {
            //             this.sound.play(msg => {
            //                 logMsg('重新播放')
            //             })
            //         }
            //
            //     } else {
            //         this.sound && this.sound.pause(msg => {
            //             logMsg('pause 暂停播放', msg)
            //         })
            //     }
            // }
        }

    }

    stop = () => {
        this.sound && this.sound.pause()
        this.sound && this.sound.stop(() => {
            logMsg('暂停播放')
        })
        this.sound = null
    }


    componentWillUnmount() {
        logMsg('暂停播放componentWillUnmount')
        this.stop();
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
        // this.pause()
    }

    handleAppStateChange(currentAppState) {
        this.pause()
    }

    render() {
        return <View/>
    }

}