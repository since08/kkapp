import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';


export class LeftAlignedImage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            height: 200,
            width: 0
        }


    }

    componentDidMount() {
        this._updateState(this.props)
    }

    _updateState = (props) => {
        const {source, maxWidth, maxHeight = 200} = props;
        Image.getSize(source.uri, (originWidth, originHeight) => {

            let width = maxHeight * originWidth / originHeight; //按照屏幕高度进行等比缩放
            width = width > maxWidth ? maxWidth : width;

            this.setState({height: maxHeight, width});


        });
    }

    render() {
        const {width, height} = this.state;
        const {onPress} = this.props;

        return (
            <TouchableOpacity
                disabled={!onPress}
                onPress={() => onPress && onPress()}
                activeOpacity={1}
            >
                <Image
                    source={this.props.source}
                    style={{
                        width, height,
                        backgroundColor: '#ECECEC'
                    }}/>

            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});