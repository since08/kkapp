import React, {Component} from 'react';
import {
    TouchableOpacity, View, TextInput,
    StyleSheet, Image, Text, KeyboardAvoidingView, FlatList, Modal, Linking, Platform
} from 'react-native';
import * as Constants from "../../configs/Constants";
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';

export default class GuidePage extends Component {

    state = {
        visible: true,
        show_index: 1
    };

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        })
    };

    show_index = () => {
        const {show_index} = this.state;
        if (show_index === 3) {
            return (
                <View style={{flexDirection: 'column', position: 'absolute', bottom: 0}}>
                    <TouchableOpacity style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          this.toggle()
                                      }}>
                        <Image style={{width: Metrics.reallySize(160), height: Metrics.reallySize(42)}}
                               source={Images.guide_next}/>
                    </TouchableOpacity>

                    <Image style={{marginTop: 17, width: 192, height: 202}} source={Images.guide3}/>

                </View>
            )
        } else if (show_index === 2) {
            return (
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'absolute',
                    right: 10,
                    bottom: (Platform.OS === 'ios') && (Metrics.screenHeight === 812 && Metrics.screenWidth === 375) ? 75 : 50
                }}>
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          this.setState({
                                              show_index: 3
                                          })

                                      }}>
                        <Image style={{width: Metrics.reallySize(160), height: Metrics.reallySize(42)}}
                               source={Images.guide_next}/>
                    </TouchableOpacity>

                    <Image style={{marginTop: 25, width: 253, height: 153}} source={Images.guide1}/>

                </View>
            )
        } else if (show_index === 1) {
            return (
                <View style={{
                    display:'flex',
                    marginTop: 50,
                    width:'100%'
                }}>

                    <Image style={{marginLeft: 10,marginBottom: 25, width: 296, height: 186}} source={Images.guide2}/>
                    <TouchableOpacity style={{alignSelf:'center',alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          this.setState({
                                              show_index: 2
                                          })
                                      }}>
                        <Image style={{width: Metrics.reallySize(160), height: Metrics.reallySize(42)}}
                               source={Images.guide_next}/>
                    </TouchableOpacity>

                </View>
            )
        }
    };

    render() {
        const {show_index} = this.state;
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                onRequestClose={() => {

                }}
                visible={this.state.visible}
                style={{alignItems: 'center'}}
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: show_index === 1 || show_index === 3 ? 'center' : 'flex-start',
                    alignItems: show_index === 3 ? 'center' : 'flex-start',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}>

                    {this.show_index()}

                </View>
            </Modal>
        )
    }
}