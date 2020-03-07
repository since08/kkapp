import React, {PureComponent} from 'react';
import {Image,Platform} from 'react-native';
import Html from 'react-native-render-html';
import ImageMark from '../../components/ImageMark'
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
import {strNotNull} from "../../utils/ComonHelper";

let img = (props) => {
    if (!props.src) {
        return false;
    }
    return <ImageMark
        key={props.src}
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}/>

}
const tagsStyles= { p: {marginTop:1,marginBottom:6,paddingTop:0,paddingBottom:0}}
const baseFontStyle={fontSize:14,letterSpacing:1.5,color:'rgb(62,62,62)',lineHeight:27}
export default class RenderHtml extends PureComponent {

    render() {
        const {html} = this.props;
        return <Html
            onLinkPress={(event, href, attribs) => {
                console.log('链接', href)
                router.toWebViewPage(attribs, href)

            }}
            baseFontStyle={baseFontStyle}
            tagsStyles={tagsStyles}
            ignoredTags={[...IGNORED_TAGS, 'br']}
            renderers={{img}}
            html={html}/>
    }


}