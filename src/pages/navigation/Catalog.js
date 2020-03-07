import React, {PureComponent} from 'react';
import {
    View, Text, Alert,
    Image, StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Images, Colors} from '../../Themes';

export default class Catalog extends PureComponent {

    state = {
        catalogs: [
            [{
                name: '汇率',
                type: 'exchange_rate',
                size: {height: 34, width: 30},
                icon: Images.macau.rate_exchange
            },
                {
                    name: '娱乐',
                    type: 'recreation',
                    size: {height: 34, width: 36},
                    icon: Images.macau.entertainment
                }
            ],
            [
                {
                    name: '酒店',
                    type: 'hotel',
                    size: {height: 32, width: 35},
                    icon: Images.macau.hotel
                },
                {
                    name: '景点',
                    type: 'scenic',
                    size: {height: 34, width: 36},
                    icon: Images.macau.viewpoint
                }
            ],
            [
                {
                    name: '美食',
                    type: 'cate',
                    size: {height: 35, width: 34},
                    icon: Images.macau.food
                },

                {
                    name: '人闻',
                    type: 'humanities',
                    size: {height: 34, width: 30},
                    icon: Images.macau.book
                }
            ],
            [
                {
                    name: '出入境',
                    type: 'entry_exit',
                    size: {height: 29, width: 31},
                    icon: Images.out_exit
                },
                {
                    name: '商城',
                    type: 'mall',
                    size: {height: 29, width: 31},
                    icon: Images.macau.store
                }
            ]


        ]
    }

    render() {

        const {catalogs} = this.state;


        return <View style={{
            height: 160, width: '100%', backgroundColor: 'white',
            justifyContent: 'center'
        }}>

            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                {this.catalogView(catalogs)}
            </View>

        </View>
    }

    catalogView = (catalogs) => {

        return catalogs.map((items, index) => <View
            key={'catalog' + index}>
            {items.map((item, count) => {
                return <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                        if (item.type === 'mall')
                            router.toMallPage()
                        else if (item.type === 'hotel') {
                            router.toSelectTimePage();
                        } else if (item.type === 'exchange_rate') {
                            router.toRatePage();
                        } else if (item.type === 'entry_exit') {
                            router.toWebView('出入境', 'http://www.fsm.gov.mo/psp/pspmonitor/mobile/PortasdoCerco.aspx')
                        } else
                            router.toHotelSearch(item)
                    }}
                    style={{
                        alignItems: 'center',
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: count === 1 ? 15 : 0
                    }}>
                    <View style={{
                        height: 35, width: 35,
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Image style={item.size}
                               source={item.icon}/>
                    </View>

                    <Text style={{
                        fontSize: 14, color: Colors._666,
                        marginTop: 5
                    }}>{item.name}</Text>

                </TouchableOpacity>
            })}
        </View>)

    }

}