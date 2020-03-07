import React, {PureComponent} from 'react';
import {
  StyleSheet, Text, View, Image,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import I18n from '../../I18n/I18n';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from './ScrollableTabBar';
import MallList from './MallList';
import propTypes from 'prop-types';
import {logMsg} from "../../utils/ComonHelper";

export default class MallTypeView extends PureComponent {
  static propTypes = {
    categories: propTypes.array.isRequired,
    // showCatePage: propTypes.func.isRequired
  };


  render() {
    const {categories} = this.props;

    if (categories && categories.length > 0) {

      return <View style={ApplicationStyles.bgContainer}>

        <ScrollableTabView
          renderTabBar={() => <TabNav/>}>

          {categories.map((item, key) => {

            return <MallList
              category={item}
              tabLabel={item.name}
              key={`mallList${key}`}/>
          })}


        </ScrollableTabView>
      </View>;
    }
    else
      return <View/>

  }

}

class TabNav extends PureComponent {

  render() {
    const {goToPage, activeTab, tabs} = this.props;
    logMsg(this.props)
    return <View style={{
      minHeight: 44, flexWrap: 'wrap',
      width: Metrics.screenWidth,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {tabs && tabs.map((name, page,index) => {
        return <TouchableOpacity
            key = {`${name}${index}`}
          onPress={() => goToPage && goToPage(page)}
          style={{height: 44, paddingLeft: 15, paddingRight: 15, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{
            fontSize: 15,
            color: activeTab === page ? '#F34A4A' : Colors.txt_444
          }}>{name}</Text>
        </TouchableOpacity>
      })}

    </View>
  }

}