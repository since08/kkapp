import React, {Component} from 'react';
import {
    View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, TextInput, Modal,
    KeyboardAvoidingView, Platform
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from "../../I18n/I18n";
import {isEmptyObject, logMsg, showToast, strNotNull, add} from "../../utils/ComonHelper";
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'


export default class InputModal extends Component {

    state = {
        comment: '',
        height: 30,
        visible: false
    };


    toggle = () => {
        if (isEmptyObject(global.login_user)) {
            global.router.toLoginFirstPage()
        } else
            this.setState({
                visible: !this.state.visible,
                comment: ''
            })
    }

    _onContentSizeChange = (event) => {
        let h = event.nativeEvent.contentSize.height;
        if (h < 30) {
            this.setState({
                height: 30
            })
        } else if (h > 106) {
            this.setState({
                height: 106
            })
        } else {
            this.setState({
                height: h
            })
        }

    }


    render() {
        return <Modal
            onRequestClose={() => {

            }}
            transparent
            visible={this.state.visible}
        >

            <KeyboardAvoidingView
                behavior={'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
                style={{flex: 1}}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.toggle}
                    style={styles.inputModal}>

                </TouchableOpacity>

                <View style={[styles.bottom_view, {height: add(this.state.height, 10)}]}>
                    <View style={{
                        width: '80%', marginLeft: 17,
                        borderWidth: 0, padding: 5
                    }}>
                        <TextInput
                            ref={'description'}
                            underlineColorAndroid="transparent"
                            style={[styles.inputComment, {height: this.state.height}]}
                            onContentSizeChange={this._onContentSizeChange.bind(this)}
                            autoGrow={true}
                            placeholder={I18n.t('write_comment')}
                            placeholderTextColor={Colors._CCC}
                            returnKeyType={'done'}
                            autoFocus={true}
                            multiline={true}
                            maxHeight={106}
                            onChangeText={(comment) => {
                                this.setState({
                                    comment
                                })
                            }}
                        />

                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (strNotNull(this.state.comment.trim())) {
                                dismissKeyboard()
                                this.props.send(this.state.comment);
                                this.toggle()
                            } else
                                showToast('内容不能为空')

                        }}
                        style={styles.release}>
                        <Text style={{color: Colors.txt_444, fontSize: 15}}>发送</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAvoidingView>
        </Modal>
    }


}

const styles = StyleSheet.create({
    bottom_view: {

        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    input: {
        height: 30,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        backgroundColor: '#ECECEE',
        borderRadius: 40,
        fontSize: 14,
        color: '#CCCCCC'
    },
    search: {
        marginLeft: 17,
        height: 30,
        width: '48%',
        backgroundColor: Colors._ECE,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchImg: {
        height: 14,
        width: 14,
        marginLeft: 15,
        marginRight: 30,
    },
    commentWhiteView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    commentWhite: {
        width: 22,
        height: 20
    },
    likeView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 31,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    like: {
        width: 20,
        height: 19
    },
    forwardView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 31,
        marginRight: 17,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    forward: {
        width: 20,
        height: 20
    },
    inputModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    release: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: 40,
        justifyContent: 'center',
        marginRight: 17
    },
    inputComment: {
        backgroundColor: Colors._ECE,
        borderRadius: 15,
        paddingLeft: 17,
        paddingRight: 4,
        fontSize: 14,
        minHeight: 30
    },

});