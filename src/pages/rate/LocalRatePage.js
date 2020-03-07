import React, {PureComponent, Component} from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, KeyboardAvoidingView
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes/index';
import {NavigationBar} from '../../components/index';
import {LoadingView, NoDataView} from '../../components/load/index';
import {getExchange_traders} from '../../services/MacauDao';
import {isEmptyObject, mul, div, formatCurrency, strNotNull} from "../../utils/ComonHelper";
import {RateTop} from './RatePage'
import Leaderboard from './Leaderboard'

const categories = [{id: 1, name: '汇率咨询达人', type: 'ex_rate'}, {id: 2, name: '积分达人', type: 'integral'}, {
  id: 3,
  name: '交友达人',
  type: 'dating'
}];

export default class LocalRatePage extends Component {

  state = {
    show_index: 1
  }
  //
  // componentDidMount() {
  //     getExchange_traders(data => {
  //         console.log("exchange_traders:", data)
  //
  //         this.setState({
  //             exchange_traders: data.items
  //         });
  //     }, err => {
  //
  //     })
  // };


  render() {
    const {show_index} = this.state;
    return (
      <View style={ApplicationStyles.bgContainer}>
        <NavigationBar
          toolbarStyle={{backgroundColor: Colors._E54}}
          title="澳门本地汇率参考"
          leftBtnIcon={Images.sign_return}
          leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
          leftBtnPress={() => router.pop()}/>

        <ScrollView style={{backgroundColor: 'white'}}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={20}>
            <RateTop
              type={'local'}/>
          </KeyboardAvoidingView>
          <View style={{
            height: 37,
            width: Metrics.screenWidth,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 17,
            backgroundColor: '#F3F3F3'
          }}>
            <Text style={{fontSize: 14, color: '#000000', fontWeight: 'bold'}}>排行榜</Text>
          </View>

          <View style={{
            paddingTop: 17,
            paddingLeft: 17,
            paddingRight: 17,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white'
          }}>
            {categories.map((item, index) => {
              return (
                <View key={index} style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <TouchableOpacity

                    style={{marginBottom: 5}}
                    onPress={() => {
                      this.setState({
                        trader_type: item.type,
                        show_index: item.id
                      })
                    }}>
                    <Text style={{
                      color: show_index === item.id ? "#E54A2E" : "#000000",
                      fontSize: 14
                    }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  {show_index === item.id ?
                    <View style={{
                      width: item.name.length * 15,
                      height: 1.5,
                      backgroundColor: '#E54A2E'
                    }}/> : null}

                </View>
              )
            })}
          </View>

          <Leaderboard
            category={categories[this.state.show_index - 1]}/>

        </ScrollView>

      </View>
    )
  }
}

