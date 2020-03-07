/**
 * Created by lorne on 2017/2/9.
 */
import React from 'react';
import {Image} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';

export default class AndroidBlur extends React.Component {
  render() {
    return (
      <Image
        style={{height: 236, width: Metrics.screenWidth}}
        source={Images.races_bg}></Image>
    );
  }
}
