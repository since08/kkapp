import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native'

type Props = {
    btnStyle: any,
    children?: any,
    title: string,
    onPress: func
}

class Button extends Component<Props> {
    render() {
        const {title, children, btnStyle, onPress} = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[{
                    height: 40, width: '30%', alignItems: 'center',
                    justifyContent: 'center', backgroundColor: '#06c8d0',
                    margin: 5
                }, btnStyle]}>
                {children ? children :
                    <Text style={{fontSize: 14, color: 'white'}}>{title ? title : '按钮'}</Text>}


            </TouchableOpacity>
        );
    }
}


export default Button;