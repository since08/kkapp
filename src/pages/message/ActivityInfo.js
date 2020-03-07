import React, {Component} from 'react';
import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Image, StatusBar,
    ScrollView, Animated, InteractionManager
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {getActivityInfo} from '../../services/AccountDao';
import {NavigationBar, MarkdownPlat} from '../../components';
import {isEmptyObject, uShareActivity} from '../../utils/ComonHelper';
import RenderHtml from '../comm/RenderHtml';

export default class ActivityInfo extends Component {

    state = {
        activity_detail:{}
    };

    componentDidMount() {
        const {activity} = this.props.params;
        getActivityInfo({id: activity.id}, data => {
            console.log("activity_detail",data)
            this.setState({
                activity_detail: data
            })
        }, err => {

        })
    }

    render() {
        const {activity_detail} = this.state;
        if(isEmptyObject(activity_detail)){
            return <NavigationBar
                title={activity_detail.title}
                toolbarStyle={{backgroundColor: Colors._E54}}
                router={router}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}
                rightBtnIcon={Images.share}
                rightImageStyle={{height: 22, width: 23, marginRight: 24.8}}
            />
        }
        return (<View style={ApplicationStyles.bgContainer}>
            <NavigationBar
                title={activity_detail.title}
                toolbarStyle={{backgroundColor: Colors._E54}}
                router={router}
                leftBtnIcon={Images.sign_return}
                leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                leftBtnPress={() => router.pop()}
                rightBtnIcon={Images.share}
                rightImageStyle={{height: 22, width: 23, marginRight: 24.8}}
                rightBtnPress={() => {
                    uShareActivity(activity_detail.title,activity_detail.intro,
                        activity_detail.banner,activity_detail.id)
                }}/>
            <ScrollView style={{marginTop:10,paddingLeft:17,paddingRight:17,paddingBottom:50}}>
                <RenderHtml
                    html={activity_detail.description}
                />
            </ScrollView>
        </View>)
    }
}