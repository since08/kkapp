/**
 * Created by lorne on 2016/12/20.
 */

import {ActionConst, Actions} from 'react-native-router-flux';
import {NavigationActions} from 'react-navigation';
import {getDispatchAction, isEmptyObject} from '../utils/ComonHelper';
import UserTopicPage from "../pages/socials/UserTopicPage";
import Crowdfunding from "../pages/crowdfundings/crowds/Crowdfunding";
import HotelDetail from "../pages/macau/HotelDetail";
import {SelectTimePage} from "../pages/macau/SelectTimePage";
import WalletPage from "../pages/wallet/WalletPage";
import NewUserTask from "../pages/navigation/NewUserTask";
import FastFoodPage from "../pages/fastBtn/FastFoodPage";
import MySavePage from "../pages/collection/MySavePage";


const customFloatFromRight = '';


export default class Router {


    log(...msg) {
        if (__DEV__)
            console.log(...msg)
    }

    stackPush(route) {

        Actions.push(route.name, {params: route.params})
        console.log('当前界面类名：' + Actions.currentScene)
    }

    push(props, route) {
        this.stackPush(route)

    }

    replace(route) {
        Actions.replace(route.name, {params: route.params})
    }


    pop() {
        Actions.pop();

    }

    popTo(route) {
        Actions.popTo(
            route.name,
            {params: route.params}
        )
    }


    popToTop() {
        getDispatchAction()['BACK_TOP']();
        Actions.popTo('tab_home')
    }

    toMySavePage(){
        this.stackPush({
            name:'MySavePage'
        })
    }
    toGameRulesPage(toggle){
        this.stackPush({
            name:'GameRulesPage',
            params:{
                toggle
            }
        })
    }
    toWinListPage(toggle){
        this.stackPush({
            name:'WinListPage',
            params:{
                toggle
            }
        })
    }
    toVisaInfoPage(){
        this.stackPush({
            name:'VisaInfoPage'
        })
    }

    toSunnaInfoPage(item){
        this.stackPush({
            name:'SunnaInfoPage',
            params:{
                item
            }
        })
    }
    toRecreationPage(item){
        this.stackPush({
            name:'RecreationPage',
            params:{
                item
            }
        })
    }
    toFastFoodPage(type){
        this.stackPush({
            name:'FastFoodPage',
            params:{
                type
            }
        })
    }

    toActivitiesPage(){
        this.stackPush({
            name:'ActivitiesPage'
        })
    }

    toRoundTripPage(){
        this.stackPush({
            name:'RoundTripPage'
        })
    }

    toCouponInfoPage(item){
        this.stackPush({
            name:'CouponInfoPage',
            params:{
                item
            }
        })
    }

    toCouponReceivePage(id){
        this.stackPush({
            name:'CouponReceivePage',
            params:{
                id
            }
        })
    }

    toNewUserTask(refresh){
        this.stackPush({
            name:'NewUserTask',
            params:{
                refresh
            }
        })
    }
    toInviteRulePage(){
        this.stackPush({
            name:'InviteRulePage'
        })
    }

    toOtherInvitePage(item){
        this.stackPush({
            name:'OtherInvitePage',
            params:{
                item
            }
        })
    }

    toUserInvitePage(user_invite){
        this.stackPush({
            name:'UserInvitePage',
            params:{
                user_invite
            }
        })
    }

    toAwardDetailPage(){
        this.stackPush({
            name:'AwardDetailPage'
        })
    }

    toInvitePage(){
        this.stackPush({
            name:'InvitePage'
        })
    }

    toWalletDetailsPage(){
        this.stackPush({
            name:'WalletDetailsPage'
        })
    }

    toWithdraw(total_account,refresh){
        this.stackPush({
            name:'Withdraw',
            params:{
                total_account,
                refresh
            }
        })
    }

    toWalletPage(refresh){
        this.stackPush({
            name:'WalletPage',
            params:{
                refresh
            }
        })
    }

    toCouponSelectPage(total_price,_selectedCoupon,coupon) {
        this.stackPush({
            name: 'CouponSelectPage',
            params: {
                total_price,
                _selectedCoupon,
                coupon
            }
        })
    }

    toReturnHotelPage(item,refresh) {
        this.stackPush({
            name: 'ReturnHotelPage',
            params: {
                item,
                refresh
            }
        })
    }

    toHotelOrderPage() {
        this.stackPush({
            name: 'HotelOrderPage'
        })
    }

    toOrderStatusPage(order_number,refresh) {
        this.stackPush({
            name: 'OrderStatusPage',
            params: {
                order_number,
                refresh
            }
        })
    }

    toRoomReservationPage(item,price_item, date,refresh) {
        this.stackPush({
            name: 'RoomReservationPage',
            params: {
                item,
                price_item,
                date,
                refresh
            }
        })
    }

    toHotelRoomListPage(hotel, date) {
        this.stackPush({
            name: 'HotelRoomListPage',
            params: {
                hotel,
                date
            }
        })
    }

    toHotelListPage(date) {
        this.stackPush({
            name: 'HotelListPage',
            params: {
                date: date
            }
        })
    }

    toRatePage() {
        this.stackPush({
            name: 'RatePage'
        })
    }
    toSelectTimePage() {
        this.stackPush({
            name: 'SelectTimePage'
        })
    }


    toInfoPage(info,refresh) {
        this.stackPush({
            name: "InfoPage",
            params: {
                info,
                refresh
            }
        })
    }

    toHotelDetail(hotel, date) {
        this.stackPush({
            name: 'HotelDetail',
            params: {
                hotel,
                date
            }
        })
    }

    toHotelSearch(item) {
        this.stackPush({
            name: 'HotelSearch',
            params: {
                item
            }
        })
    }

    toCamera(params) {
        this.stackPush({
            name: "CameraVideo",
            params
        })
    }

    toSocialContact(params) {
        this.stackPush({
            name: "SocialContact",
            params: params
        })
    }

    toBlackList() {
        this.stackPush({
            name: "Blacklist",
        })
    }

    toLocation(params) {
        this.stackPush({
            name: "Location",
            params
        })
    }


    toNearFriend() {
        if (isEmptyObject(global.login_user)) {
            this.toLoginFirstPage()
        } else
            this.stackPush({
                name: 'NearFriend'
            })
    }

    toCrowdfunding() {
        this.stackPush({
            name: 'Crowdfunding'
        })
    }

    toMallPage() {
        this.stackPush({
            name: 'MallPage'
        })
    }

    toSquare() {
        this.stackPush({
            name: 'Square'
        })
    }

    popToAriticle() {
        this.pop()
        Actions.tab_news({type: ActionConst.REPLACE})
    }


    toUserTopicPage(userInfo) {
        this.stackPush({
            name: 'UserTopicPage',
            params: {
                userInfo
            }
        })
    }


    toArticleRelease(articleKey, articleInfo, reloadInfo) {
        this.stackPush({
            name: "ArticleRelease",
            params: {
                articleKey,
                articleInfo,
                reloadInfo,
            },
        })
    }

    toSendMood() {
        this.stackPush({
            name: "MoodRelease"
        })
    }

    toLongArticle(article, isComment) {
        this.stackPush({
            name: 'LongArticle',
            params: {
                article,
                isComment
            }
        })
    }

    toArticleList() {
        this.stackPush({
            name: "ArticleList",
        })
    }


    replaceCrowdOrder(order_number) {
        this.replace({
            name: 'SubscriptionInfoPage',
            params: {
                order_number
            }
        })
    }

    toRecordList() {
        this.stackPush({name: 'RecordList'})
    }


    toPokerB() {
        this.stackPush({name: 'PokerB'})
    }

    toSubscriptionInfoPage(order_number) {
        this.stackPush({
            name: 'SubscriptionInfoPage',
            params: {
                order_number
            }
        })
    }

    toRiskWarningPage(sumMoney, order_info, clickImg, order) {
        this.stackPush({
            name: 'RiskWarningPage',
            params: {
                sumMoney: sumMoney,
                order_info: order_info,
                clickImg: clickImg,
                order: order
            }
        })
    }

    toSubscriptionConfirmPage(order_info, verified) {
        this.stackPush({
            name: 'SubscriptionConfirmPage',
            params: {
                order_info, verified
            }
        })
    }

    toSubscriptionPage(crowd, player) {

        this.stackPush({
            name: 'SubscriptionPage',
            params: {
                crowd: crowd,
                player: player
            }

        })
    }

    toPokerInfo(crowd, player) {
        this.stackPush({
            name: 'PokerInfo',
            params: {
                crowd,
                player
            }
        })
    }


    toCrowdDetailPage(crowd) {
        this.stackPush({
            name: 'CrowdDetail',
            params: {
                crowd
            }
        })
    }

    toSelectPlayer(crowd) {
        this.stackPush({
            name: 'SelectPlayerPage',
            params: {
                crowd
            }
        })
    }

    toReportPage(crowd) {
        this.stackPush({
            name: 'ReportPage',
            params: {
                crowd: crowd
            }
        })
    }

    toDeletePage() {
        this.stackPush({
            name: 'DeletePage',

        })
    }

    toReceivedReply() {
        this.stackPush({
            name: 'ReceivedReplyPage',

        })
    }

    toPersonDynamic(userInfo) {
        this.stackPush({
            name: 'PersonDynamicPage',
            params: {
                userInfo
            }
        })
    }

    toMallSelectPage(orderItem, mallRefresh) {
        this.stackPush({
            name: 'MallSelectPage',
            params: {
                orderItem,
                mallRefresh
            }
        })
    }


    toLogisticsWeb(shipments) {
        this.stackPush({
            name: 'LogisticsWeb',
            params: {shipments: shipments}
        })
    }

    /*物流查看*/
    toLogisticsPage(orderItem) {
        this.stackPush({
            name: 'LogisticsPage',
            params: {
                orderItem: orderItem
            }
        })
    }


    toMallResult(categories) {
        this.stackPush({
            name: 'MallSearchResult',
            params: {category: categories}
        })
    }

    replaceProductInfo(product) {
        Actions.replace('MallInfoPage', {
            params: product
        })
    }

    replaceShoppingCart() {
        Actions.replace('ShoppingCart')
    }

    toSearchHomePage() {
        this.stackPush({
            name: 'SearchHomePage'
        })
    }
    toSearchMallPage() {
        this.stackPush({
            name: 'SearchMallPage'
        })
    }

    popToTopRefresh() {
        Actions.reset('Main');

    }

    toTabNews() {
        Actions.tab_news({type: ActionConst.REPLACE})
    }

    toSearchVideo() {
        this.stackPush({name: 'SearchVideo'})
    }

    toAddVerified(cert_type, refresh, verified) {
        this.stackPush({
            name: 'AddVerified',
            params: {
                cert_type: cert_type,
                verified_refresh: refresh,
                verified: verified
            }
        })
    }

    toMyWardsPage() {
        this.stackPush({
            name: 'MyWardsPage'
        })
    }

    toWardReceivePage(refresh,item) {
        this.stackPush({
            name: 'WardReceivePage',
            params:{
                refresh,
                item
            }
        })
    }

    toVerifiedPage(backRefresh) {
        this.stackPush({
            name: 'VerifiedPage',
            params: {
                backRefresh: backRefresh
            }
        })
    }

    toActivityInfo(props, activity) {
        this.push(props, {
            name: 'ActivityInfo',
            sceneConfig: customFloatFromRight,
            params: {
                activity: activity
            }
        })
    }

    toActivityCenter(props, activities) {
        this.push(props, {

            name: 'ActivityCenter',
            sceneConfig: customFloatFromRight,
            params: {
                activities: activities
            }
        })
    }


    toMessageCenter(props) {
        this.push(props, {
            name: 'MessageCenter'
        })
    }


    toInputPwd(wx) {
        console.log('微信：', wx)
        this.stackPush({
            name: 'InputPwd',
            params: {
                wx: wx
            }
        })
    }

    toWxRegister(props, wxAuth) {
        this.push(props, {
            name: 'WxRegister',
            params: {
                access_token: wxAuth
            }
        })
    }

    toSuggest(props) {
        this.push(props, {

            name: 'Suggest',
            sceneConfig: customFloatFromRight,
        })
    }

    toProtocol(props, _protocol) {
        this.push(props, {

            name: 'Protocol',
            sceneConfig: customFloatFromRight,
            params: {
                _protocol: _protocol
            }

        })
    }


    replaceOrder(order_id, price) {

        Actions.replace('OrderInfoPage', {
            params: {
                order_id: order_id,
                price: price
            }
        })


    }


    toWebViewPay(props, pay, orderRefresh) {
        this.push(props, {

            name: 'WebViewPay',
            sceneConfig: customFloatFromRight,
            params: {
                pay: pay,
                orderRefresh: orderRefresh
            }
        })
    }


    toSearchPoker(props) {
        this.push(props, {

            name: 'SearchPoker',
            sceneConfig: customFloatFromRight,

        })
    }

    toPokerRacePage(props, race_id) {
        this.push(props, {

            name: 'PokerRacePage',
            sceneConfig: customFloatFromRight,
            params: {
                race_id: race_id
            }

        })
    }

    toPokerRankPage(player_id) {
        this.stackPush({
            name: 'PokerRankPage',
            params: {
                player_id: player_id
            }

        })
    }

    toAdrListPage(props, selectAdr, adrData) {
        this.push(props, {
            name: 'AdrListPage',
            params: {
                selectAdr: selectAdr,
                adrData: adrData
            }

        })
    }

    toNewAddressPage(props, getList, address) {
        this.push(props, {
            name: 'NewAddressPage',
            params: {
                getList: getList,
                address: address
            }

        })
    }

    toWebViewPage(props, url) {
        this.stackPush({
            name: 'WebViewPage',
            params: {
                url: url
            }

        })
    }

    toWebView(name,url) {
        this.stackPush({
            name: 'WebViewPage',
            params: {
                url: url,
                name:name
            }

        })
    }


    toTicketInfoPage(props, race_id, ticket_id, isBuy) {
        this.push(props, {
            name: 'TicketInfoPage',
            params: {
                race_id: race_id,
                ticket_id: ticket_id,
                isBuy: isBuy
            }

        })
    }

    toChoiseTicketPage(props, race_id) {
        this.push(props, {
            name: 'ChoiseTicketPage',
            params: {
                race_id: race_id
            }

        })
    }


    toTicketSearchPage(props) {
        this.push(props, {
            name: 'TicketSearchPage',
        })
    }

    toVideoPage(props) {
        this.push(props, {
            name: 'MainVideoPage',

        })
    }

    toDrawerRank(props) {
        this.push(props, {
            name: 'DrawerRank',

        })
    }

    toMessagePage(props) {
        this.push(props, {
            name: 'MessagePage',

        })
    }


    toChangePhonePage(props) {
        this.push(props, {
            name: 'ChangePhonePage',

        })
    }


    toBindingPhonePage(props) {
        this.push(props, {
            name: 'BindingPhonePage',

        })
    }


    toApiSettingPage(props) {
        this.push(props, {
            name: 'ApiSettingPage',

        })
    }

    toTicketPage(props) {
        this.push(props, {

            name: 'TicketPage',


        })
    }


    toSearchNewsPage(props) {
        this.push(props, {

            name: 'SearchNewsPage',


        })
    }

    toVideoInfo(video_id) {
        this.stackPush({
            name: 'VideoInfoPage',
            params: {
                video_id: video_id
            }

        })
    }

    toVideoInfoPage(props, info) {
        this.push(props, {

            name: 'VideoInfoPage',
            params: {
                info: info
            }

        })
    }

    toNewsInfo(news_id) {
        this.stackPush({
            name: 'NewsInfoPage',
            params: {
                news_id: news_id
            }
        })
    }

    toNewsInfoPage(props, newsInfo) {
        this.push(props, {

            name: 'NewsInfoPage',
            params: {
                newsInfo: newsInfo
            }

        })
    }


    toMainNewsPage(props) {
        this.push(props, {

            name: 'MainNewsPage',

        })
    }


    toAboutPage(props) {
        this.push(props, {

            name: 'AboutPage',

        })
    }


    toSearchKeywordPage() {
        this.stackPush({
            name: 'SearchKeywordPage',

        })
    }

    toChildRaceInfoPage(props, race_ids) {
        this.push(props, {

            name: 'ChildRaceInfoPage',
            params: {
                race_ids: race_ids
            }
        })
    }

    toBusinessPage(props) {
        this.push(props, {

            name: 'BusinessPage',
        })
    }


    toSearchRacesPage(props) {
        this.push(props, {
            name: 'SearchRacesPage',
        })
    }


    toModifyPwdPage(props) {
        this.push(props, {
            name: 'ModifyPwdPage',
        })
    }

    toSecurityPage(props) {
        this.push(props, {
            name: 'SecurityPage',

        })
    }


    toOrderListPage(props) {
        this.push(props, {

            name: 'OrderListPage',

        })
    }

    toCertificationPage(props) {
        this.push(props, {

            name: 'CertificationPage',

        })
    }

    toBuyKnownPage(props) {
        this.push(props, {

            name: 'BuyKnowPage'

        })
    }

    toOrderInfo(props, order_id, price, isPay) {
        this.push(props, {

            name: 'OrderInfoPage',
            params: {
                order_id: order_id,
                isPay: isPay,
                price: price
            }

        })
    }

    toOrderInfoPage(props, order_id, price, onRefresh) {
        this.push(props, {

            name: 'OrderInfoPage',
            params: {
                order_id: order_id,
                price: price,
                onRefresh: onRefresh
            }
        })
    }

    toBuyTicketPage(props, race_id, ticket_id) {
        this.push(props, {

            name: 'BuyTicketPage',
            params: {
                race_id: race_id,
                ticket_id: ticket_id
            }
        })
    }

    toForgetEmailPage(props) {
        this.push(props, {

            name: 'ForgetEmailPage'
        })
    }

    toImageGalleryPage(images, index) {
        this.stackPush({
            name: 'ImageGallery',
            params: {
                images: images,
                index: index
            }
        })
    }

    popToLoginFirstPage() {
        this.stackPush({
            name: 'LoginFirstPage',
        })

    }

    toEmailRegisterPage(props) {
        this.push(props, {
            name: 'EmailRegisterPage',
        })
    }

    toLoginFirstPage(refresh) {
        this.stackPush({
            name: 'LoginFirstPage',
            params: {
                refresh
            }
        })
    }

    toLoginCodePage(props) {
        this.push(props, {
            name: 'LoginCodePage',
        })
    }

    toRacesInfoPage(props, race_id, fromBuy) {
        this.push(props, {

            name: 'RaceScene',
            params: {
                race_id: race_id,
                fromBuy: fromBuy
            }
        })
    }

    toFocusPlayer(props) {
        this.push(props, {
            name: 'FocusPlayer',
        })
    }

    toForgetPage(props) {
        this.push(props, {
            name: 'ForgetPage',
        })
    }

    toRegisterPage(props) {
        this.push(props, {

            name: 'RegisterPage',
        })
    }

    forgetPhoneToPwdPage(props, phone, code,ext) {
        this.push(props, {

            name: 'InputPwdPage',
            params: {
                phone: phone,
                isEmailOrMobile: 'mobile',
                code: code,
                isRegisterOrForget: 'forget',
                ext:ext

            }
        })
    }

    forgetEmailToPwdPage(props, email, code) {
        this.push(props, {
            name: 'InputPwdPage',
            params: {
                email: email,
                isEmailOrMobile: 'email',
                code: code,
                isRegisterOrForget: 'forget'

            }
        })
    }


    toInputPwdPage(props, phone, code,ext) {
        this.push(props, {

            name: 'InputPwdPage',
            params: {
                phone: phone,
                code: code,
                isEmailOrMobile: 'mobile',
                isRegisterOrForget: 'register',
                ext:ext
            }
        })
    }


    toPersonPage(props) {

        this.push(props, {
            name: 'PersonPage',
        })
    }

    toMallInfoPage(product) {
        this.stackPush({
            name: 'MallInfoPage',
            params: product
        })
    }


    toSettingPage(props) {
        this.push(props, {

            name: 'SettingPage',

        })
    }


    toMessageList(userInfo) {
        this.stackPush({
            name: 'ChatRoom',
            params: {
                userInfo
            }
        })
    }

    popToLogin() {
        Actions.popTo('LoginFirstPage')
    }

    popToDrawerRank(navigation) {
        console.log(Actions._state.routes);

        let route = Actions._state.routes[1];
        const backTo = NavigationActions.back({
            key: route.key
        });

        navigation.dispatch(backTo)

    }

    toLocalRatePage() {
        this.stackPush({
            name: 'LocalRatePage'
        })
    }

    toCouponPage() {
        this.stackPush({
            name: 'CouponPage'
        })
    }

    toWebPage(url, body) {
        this.stackPush({
            name: 'WebPage',
            params: {url: url, body: body}
        })
    }

    toShippingCart() {
        this.stackPush({
            name: 'ShoppingCart',
        })
    }

    toOrderConfirm(selectedData) {
        this.stackPush({
            name: 'OrderSubmitPage',
            params: selectedData
        })
    }

    toMallOrderInfo(item, listRefresh) {
        this.stackPush({
            name: 'MallOrderInfo',
            params: {
                orderDetail: item,
                listRefresh: listRefresh
            }
        })
    }

    replaceMallOrderInfo(item) {
        this.replace({
            name: 'MallOrderInfo',
            params: {orderDetail: item}
        })
    }

    toReturnPage(orderItems, order_number,mallRefresh) {
        this.stackPush({
            name: 'ReturnPage',
            params: {
                order_items: orderItems,
                order_number: order_number,
                mallRefresh:mallRefresh
            }
        })
    }

    toReturnSucceedPage() {
        this.stackPush({
            name: 'ReturnSucceedPage',

        })
    }

    toMallOrderPage() {
        this.stackPush({
            name: 'MallOrderPage'
        })
    }

    toIntegralInfoPage(id,total_points,refresh) {
        this.stackPush({
            name: 'IntegralInfoPage',
            params: {
                id,
                total_points,
                refresh
            }
        })
    }

    toIntegralMallPage(total_points) {
        this.stackPush({
            name: 'IntegralMallPage',
            params: {
                total_points
            }
        })
    }

    toIntegralPage(total_points) {
        this.stackPush({
            name: 'IntegralPage',
            params: {
                total_points: total_points
            }
        })
    }

    toIntegralRulePage() {
        this.stackPush({
            name: 'IntegralRulePage'
        })
    }

    toIntegralDetailsPage() {
        this.stackPush({
            name: 'IntegralDetailsPage'
        })
    }

    toCommentInfoPage(item) {
        this.stackPush({
            name: 'CommentInfoPage',
            params: {
                item: item
            }
        })
    }


}
