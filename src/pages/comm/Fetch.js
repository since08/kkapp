/**
 * Created by lorne on 2018/5/13
 * Function:
 * Desc:
 */
import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {isEqual} from 'lodash';
import {isEmptyObject} from "../../utils/ComonHelper";
import LoadingView from "../../components/load/LoadingView";
import LoadErrorView from "../../components/load/LoadErrorView";

const PENDING = 0
const SUCCESS = 1
const FAILURE = 2

export default (Origin, fetchData) => {
    return class Fetch extends Component {

        state = {
            data: null,
            status: PENDING,
        }

        componentWillMount() {
            this.loadData(this.props)
        }

        componentWillReceiveProps(nextProps) {
            if (isEqual(nextProps, this.props)) return

            this.loadData(nextProps)
        }

        loadData = () => {
            fetchData(data => {
                this.setState({
                    status: isEmptyObject(data) ? FAILURE : SUCCESS,
                    data
                })

            }, err => {
                this.setState({
                    status: FAILURE
                })
            })
        }

        render() {
            const {status, data} = this.state

            if (status === SUCCESS) {
                return <Origin {...this.props} data={data}/>
            }

            if (status === PENDING) {
                return <LoadingView/>
            }

            if (status === FAILURE) {
                return <LoadErrorView
                    onPress={() => this.loadData()}/>
            }
            return null
        }
    }

}