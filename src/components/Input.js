/**
 * Input.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/5/22.
 *
 */

import React, {Component} from 'react';
import {TextInput} from 'react-native';
import PropTypes from 'prop-types';

class Input extends Component {
    render() {
        const {style, onChangeText, placeholder, others} = this.props;
        return <TextInput
            {...others}
            placeholderTextColor={'#D1D1D1'}
            onChangeText={onChangeText}
            placeholder={placeholder ? placeholder : '输入文本框'}
            underlineColorAndroid={'transparent'}
            style={[{height: 40, fontSize: 14, color: 'black', flex: 1}, style]}/>
    }
}

Input.propTypes = {
    style: PropTypes.any,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    others: PropTypes.object

};

export default Input;

  