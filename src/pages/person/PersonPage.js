/**
 * Created by lorne on 2017/1/4.
 */
import React, {Component} from 'react';
import {
    ActivityIndicator, View, Text, Alert
} from 'react-native';
import {connect} from 'react-redux';
import {Colors, Images} from '../../Themes';
import I18n from '../../I18n/I18n';
import {fetchGetProfile, fetchPutProfile, fetchPostAvatar} from '../../actions/PersonAction'
import PersonInfo from './PersonInfo';
import {NavigationBar, BaseComponent} from '../../components'
import {getLoginUser, strNotNull} from '../../utils/ComonHelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {PUT_PROFILE} from "../../actions/ActionTypes";

class PersonPage extends Component {

    state = {
        user_id: null
    };

    componentDidMount() {
        this._loadProfile();

    }

    _loadProfile() {

        const {user_id} = getLoginUser();
        if (strNotNull(user_id)) {
            this.props._getProfile(user_id);
            this.setState({user_id: user_id})
        }

    }


    _putProfile = () => {
        const {profile} = this.Profile.props;
        this.props._putProfile(profile.user_id, profile,(type)=>{
            this.base.close();
            if(type==='success'){
                router.pop()
            }
        });
    };




    render() {

        let {loading, error, hasData, profile, actionType} = this.props;
        profile = {...profile}

        return (
            <BaseComponent
                ref={ref => this.base = ref}
                testID="page_profile"
                style={{backgroundColor: '#ECECEE', flex: 1}}>
                <NavigationBar
                    toolbarStyle={{backgroundColor: Colors._E54}}
                    title={I18n.t('edit_info')}
                    rightBtnText={I18n.t('save_s')}
                    leftBtnIcon={Images.sign_return}
                    leftImageStyle={{height: 19, width: 11, marginLeft: 20, marginRight: 20}}
                    leftBtnPress={() => router.pop()}
                    rightBtnPress={() => {

                        Alert.alert(
                            I18n.t("save_title"),
                            '',
                            [
                                {text: I18n.t("save_n"), onPress: () => router.pop()},
                                {
                                    text: I18n.t("save_s"), onPress: () => {
                                        this.base.open();
                                        this._putProfile();

                                    }
                                },
                            ],
                            {cancelable: false}
                        )
                    }}/>

                <KeyboardAwareScrollView>

                    <PersonInfo
                        postAvatar={this.props._postAvatar}
                        ref={ref => this.Profile = ref}
                        profile={profile}/>


                </KeyboardAwareScrollView>
            </BaseComponent>
        )
    }
}


function bindAction(dispatch) {
    return {
        _getProfile: (user_id) => dispatch(fetchGetProfile(user_id)),
        _putProfile: (user_id, body,callback) => dispatch(fetchPutProfile(user_id, body,callback)),
        _postAvatar: (body) => dispatch(fetchPostAvatar(body))
    };
}


const mapStateToProps = state => ({
    loading: state.PersonState.loading,
    profile: state.PersonState.profile,
    error: state.PersonState.error,
    hasData: state.PersonState.hasData,
    actionType: state.PersonState.actionType,
    user_extra: state.TicketOrderState.user_extra

});

export default connect(mapStateToProps, bindAction)(PersonPage);