import React, {PureComponent, Component} from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ScrollView, FlatList
} from 'react-native';
import {Colors, Fonts, Images, ApplicationStyles, Metrics} from '../../Themes';
import {NavigationBar} from '../../components';
import {isEmptyObject, convertDate} from "../../utils/ComonHelper";
import * as Animatable from 'react-native-animatable';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import moment from 'moment'

LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales.fr = {
    monthNames: [
        '二月',
        '一月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
        '一月',
    ],
    monthNamesShort: [
        '二月',
        '一月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
        '一月',
    ],
    dayNames: [
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
    ],
    dayNamesShort: ['日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',]
};

LocaleConfig.defaultLocale = 'fr';
let seleactDatas = [];

export default class TimeSpecificationInfo extends PureComponent {


    constructor(props) {
        super(props)

        let date = convertDate(new Date(), 'YYYY-MM-DD');
        this.minDate = date;

        this.markedArr = [];

        this.state = {
            calendarProps: {}
        }


    }

    nDayPress = (day) => {


        let dateString = day.dateString;


        if (this.markedArr.length < 2) {

            let markedDates = {}
            let props = {}

            //第一次选择
            if (this.markedArr.length === 0) {
                this.markedArr.push(dateString)
                markedDates[dateString] = {
                    selected: true
                }

                props = {
                    markedDates
                }
                this.setState({
                    calendarProps: props
                })

            } else {//第二次选择
                this.markedArr.push(dateString)
                let start = new Date(this.markedArr[0]);
                let end = new Date(this.markedArr[1]);
                if (this.markedArr[0] === this.markedArr[1]) {
                    this.markedDates = {}
                    this.markedArr = [];
                    this.nDayPress(day)
                    return;
                }
                if (start < end) {
                    seleactDatas = getDates(start, end)
                } else {
                    seleactDatas = getDates(end, start)
                }
                seleactDatas.forEach((item, index, arr) => {
                    if (index === 0) {
                        markedDates[item] = {startingDay: true, color: '#FA6E55', textColor: '#FFFFFF'};
                        return;
                    }
                    if (index === arr.length - 1) {
                        markedDates[item] = {endingDay: true, color: '#FA6E55', textColor: '#FFFFFF'};
                        return;
                    }

                    markedDates[item] = {color: '#FA6E55', textColor: '#FFFFFF'};
                })
                props = {
                    markedDates,
                    markingType: 'period'
                }
                this.setState({
                    calendarProps: props
                })

                setTimeout(() => {
                    this.submit()
                }, 500)


            }
            console.log("seleactDatas:", seleactDatas)
            console.log("markedDates:", markedDates)


        } else {
            this.markedDates = {}
            this.markedArr = [];
            this.nDayPress(day)
        }

    }


    submit = () => {
        this.props.showSpecInfo();
        if (seleactDatas.length > 0) {
            this.props._change({
                begin_date: seleactDatas[0],
                end_date: seleactDatas[seleactDatas.length - 1],
                counts: seleactDatas.length - 1
            })
        }
    }

    render() {
        return (
            <Animatable.View
                duration={300}
                style={styles.page}>
                <TouchableOpacity
                    style={{height: 146, width: '100%'}}
                    onPress={this.submit}>

                </TouchableOpacity>
                <View style={styles.View}>
                    <View style={{
                        height: 55, width: Metrics.screenWidth, backgroundColor: 'white',
                        alignItems: 'center', flexDirection: 'row',
                        borderBottomColor: Colors._ECE, borderBottomWidth: 1
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.showSpecInfo();
                            }}
                            style={{justifyContent: 'center', alignItems: 'center', height: 55, width: 60}}>
                            <Text style={{color: '#E54A2E', fontSize: 12}}>取消</Text>
                        </TouchableOpacity>

                        <View style={{flex: 1}}/>
                        <Text style={{color: '#444444', fontSize: 14}}>请选择入住时间</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            style={{justifyContent: 'center', alignItems: 'center', height: 55, width: 60}}>
                        </TouchableOpacity>

                    </View>
                    <CalendarList
                        pastScrollRange={0}
                        minDate={this.minDate}
                        onDayPress={this.nDayPress}
                        firstDay={1}
                        {...this.state.calendarProps}
                        monthFormat={'yyyy年MM月'}
                        theme={{
                            selectedDayTextColor: 'white',
                            selectedDayBackgroundColor: '#FA6E55',
                            textDayHeaderColor: '#FA6E55',
                            todayTextColor: 'black'
                        }}

                    />

                </View>
            </Animatable.View>
        );
    }


}


getDates = (startDate, stopDate) => {
    console.log(startDate, stopDate)
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(convertDate(currentDate, 'YYYY-MM-DD'));
        currentDate = moment(currentDate).add(1, 'days')
    }
    console.log("dateArray", dateArray)
    return dateArray;
}

addDays = (dat, days) => {

    dat.setDate(dat.getDate() + days);
    return dat;
};

export class Arrow extends Component {
    render() {
        return (
            <Text>取消</Text>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999
    },
    View: {
        flex: 1,
        backgroundColor: 'white',
        left: 0,
        right: 0,
        bottom: 0
    }


})