import {Actions, Scene, ActionConst, Tabs} from 'react-native-router-flux';
import React from 'react';
import {View, StatusBar} from 'react-native';
//Pages
import HotelDetail from '../pages/macau/HotelDetail';
import CameraVideo from '../pages/comm/CameraVideo';
import UserTopicPage from '../pages/socials/UserTopicPage';
import MoodRelease from '../pages/socials/MoodRelease';
import LongArticle from '../pages/socials/LongArticle';
import ArticleRelease from '../pages/socials/ArticleRelease';
import ArticleList from '../pages/socials/ArticleList';
import SearchMallPage from '../pages/malls/SearchMallPage';
import SearchVideo from '../pages/videos/SearchVideo';
import HomePage from '../pages/HomePage';
import InputPwdPage from '../pages/InputPwdPage';
import DrawerPage from '../pages/DrawerPage';
import PersonPage from '../pages/person/PersonPage';
import SettingPage from '../pages/setting/SettingPage';
import RegisterPage from '../pages/account/RegisterPage';
import ForgetPage from '../pages/account/ForgetPage';
import LoginFirstPage from '../pages/login/LoginFirstPage';
import LoginCodePage from '../pages/login/LoginCodePage';
import EmailRegisterPage from '../pages/account/EmailRegisterPage';
import ImageGallery from '../components/ImageGallery';
import ForgetEmailPage from '../pages/account/ForgetEmailPage';
import BuyTicketPage from '../pages/buy/BuyTicketPage';
import OrderInfoPage from '../pages/orders/OrderInfoPage';
import BuyKnowPage from '../pages/buy/BuyKnownPage';
import CertificationPage from '../pages/buy/CertificationPage';
import OrderListPage from '../pages/orders/OrderListPage';
import SecurityPage from '../pages/setting/SecurityPage';
import ModifyPwdPage from '../pages/setting/ModifyPwdPage';
import SearchRacesPage from '../pages/races/SearchRacesPage';
import BusinessPage from '../pages/setting/BusinessPage';
import SearchKeywordPage from '../pages/races/SearchKeywordPage';
import ChildRaceInfoPage from '../pages/races/ChildRaceInfoPage';
import AboutPage from '../pages/setting/AboutPage';
import PokerPersonPage from '../pages/person/PokerPersonPage';
import MainNewsPage from '../pages/news/MainNewsPage';
import NewsInfoPage from '../pages/news/NewsInfoPage';
import SearchNewsPage from '../pages/news/SearchNewsPage';
import TicketPage from '../pages/ticket/TicketPage';
import ApiSettingPage from '../pages/setting/ApiSettingPage';
import BindingPhonePage from '../pages/setting/BindingPhonePage';
import ChangePhonePage from '../pages/setting/ChangePhonePage';
import MessagePage from '../pages/message/MessagePage';
import MainVideoPage from '../pages/videos/MainVideoPage';
import VideoInfoPage from '../pages/videos/VideoInfoPage';
import TicketSearchPage from '../pages/ticket/TicketSearchPage';
import ChoiseTicketPage from '../pages/ticket/ChoiseTicketPage';
import TicketInfoPage from '../pages/ticket/TicketInfoPage';
import WebViewPage from '../components/WebViewPage';
import NewAddressPage from '../pages/buy/NewAddressPage';
import AdrListPage from '../pages/buy/AdrListPage';
import DrawerRank from '../pages/rank/DrawerRank';
import FocusPlayer from '../pages/rank/FocusPlayer';
import PokerRankPage from '../pages/rank/info/PokerRankPage';
import PokerRacePage from '../pages/rank/info/PokerRacePage';
import SearchPoker from '../pages/rank/SearchPoker';
import WebViewPay from '../components/WebViewPay';
import Protocol from '../pages/setting/ProtocolPage';
import Suggest from '../pages/setting/Suggest';
import WxRegister from '../pages/account/WxRegister';
import InputPwd from '../pages/account/InputPwd';
import MessageCenter from '../pages/message/MessageCenter';
import ActivityCenter from '../pages/message/ActivityCenter';
import ActivityInfo from '../pages/message/ActivityInfo';
import VerifiedPage from '../pages/verifieds/VerifiedPage';
import AddVerified from '../pages/verifieds/AddVerified';
import RaceScene from '../pages/races/RaceScene';
import MallInfoPage from '../pages/malls/mallInfo/MallInfoPage';
import {Navigation} from '../pages/navigation/Navigation';
import ShoppingCart from '../pages/malls/shoppingCart/ShoppingCart';
import EmptyCart from '../pages/malls/shoppingCart/EmptyCart';
import MallSearchResult from '../pages/malls/MallSearchResult';
import OrderSubmitPage from '../pages/malls/submitOrder/OrderSubmitPage';
import MallOrderInfo from '../pages/malls/orderInfo/MallOrderInfo';
import ReturnPage from '../pages/malls/return/ReturnPage';
import ReturnSucceedPage from '../pages/malls/return/ReturnSucceedPage';
import MallOrderPage from '../pages/malls/mallOrder/MallOrderPage';
import LogisticsPage from '../pages/malls/mallOrder/LogisticsPage';
import {LogisticsWeb} from '../components';
import MallSelectPage from '../pages/malls/return/MallSelectPage';
import WebPage from '../pages/WebPage';
import PersonDynamicPage from '../pages/comment/PersonDynamicPage';
import CommentInfoPage from '../pages/comment/CommentInfoPage';
import ReceivedReplyPage from '../pages/comment/ReceivedReplyPage';
import DeletePage from '../pages/comment/DeletePage';
import Crowdfunding from '../pages/crowdfundings/crowds/Crowdfunding';
import CrowdDetail from '../pages/crowdfundings/crowds/CrowdDetail';
import ReportPage from '../pages/crowdfundings/reports/ReportPage';
import PokerInfo from '../pages/crowdfundings/PokerInfo';
import SelectPlayerPage from '../pages/crowdfundings/SelectPlayerPage';
import PokerB from '../pages/crowdfundings/PokerB';
import SubscriptionPage from '../pages/crowdfundings/orders/SubscriptionPage';
import SubscriptionConfirmPage from '../pages/crowdfundings/orders/SubscriptionConfirmPage';
import RiskWarningPage from '../pages/crowdfundings/orders/RiskWarningPage';
import RecordList from '../pages/crowdfundings/orders/RecordList';
import SubscriptionInfoPage from '../pages/crowdfundings/orders/SubscriptionInfoPage';
import ChatRoom from '../pages/chat/ChatRoom';
import Location from '../pages/socials/Location';
import Blacklist from '../pages/socials/Blacklist';
import SocialContact from '../pages/socials/SocialContact';
import ExpandText from '../pages/comm/Record';
import Square from '../pages/socials/Square';
import MallPage from '../pages/malls/MallPage';
import NearFriend from '../pages/socials/NearFriend';
import HotelSearch from '../pages/macau/HotelSearch';
import InfoPage from '../pages/macau/InfoPage';
import IntegralPage from '../pages/integral/IntegralPage';
import IntegralRulePage from '../pages/integral/IntegralRulePage';
import IntegralDetailsPage from '../pages/integral/IntegralDetailsPage';
import SelectTimePage from '../pages/macau/SelectTimePage';
import HotelListPage from '../pages/macau/HotelListPage';
import HotelRoomListPage from '../pages/macau/HotelRoomListPage';
import RoomReservationPage from '../pages/macau/RoomReservationPage';
import OrderStatusPage from '../pages/macau/hotelOrder/OrderStatusPage';
import HotelOrderPage from '../pages/macau/hotelOrder/HotelOrderPage';
import ReturnHotelPage from '../pages/macau/return/ReturnHotelPage';
import IntegralMallPage from '../pages/integral/IntegralMallPage';
import IntegralInfoPage from '../pages/integral/IntegralInfoPage';
import CouponPage from '../pages/coupon/CouponPage';
import CouponSelectPage from '../pages/coupon/CouponSelectPage';
import RatePage from '../pages/rate/RatePage';
import LocalRatePage from '../pages/rate/LocalRatePage';
import WalletPage from '../pages/wallet/WalletPage';
import Withdraw from '../pages/wallet/Withdraw';
import WalletDetailsPage from '../pages/wallet/WalletDetailsPage';
import InvitePage from '../pages/wallet/InvitePage';
import AwardDetailPage from '../pages/wallet/AwardDetailPage';
import UserInvitePage from '../pages/wallet/UserInvitePage';
import OtherInvitePage from '../pages/wallet/OtherInvitePage';
import InviteRulePage from '../pages/wallet/InviteRulePage';
import NewUserTask from '../pages/navigation/NewUserTask';
import CouponReceivePage from '../pages/coupon/CouponReceivePage';
import CouponInfoPage from '../pages/coupon/CouponInfoPage';
import RoundTripPage from '../pages/fastBtn/RoundTripPage';
import FastFoodPage from '../pages/fastBtn/FastFoodPage';
import ActivitiesPage from '../pages/activity/ActivitiesPage';
import RecreationPage from '../pages/macau/RecreationPage';
import SunnaInfoPage from '../pages/macau/SunnaInfoPage';
import GameRulesPage from '../pages/lottery/GameRulesPage';
import MyWardsPage from '../pages/lottery/MyWardsPage';
import WardReceivePage from '../pages/lottery/WardReceivePage';
import SearchHomePage from '../pages/navigation/SearchHomePage';
import VisaInfoPage from '../pages/fastBtn/VisaInfoPage';
import WinListPage from '../pages/lottery/WinListPage';
import MySavePage from '../pages/collection/MySavePage';
import Splash from '../pages/Splash';

export const Stacks = Actions.create(
  <Scene key="root">
    <Scene key="MySavePage" component={MySavePage} hideNavBar />
    <Scene key="WinListPage" component={WinListPage} hideNavBar />
    <Scene key="VisaInfoPage" component={VisaInfoPage} hideNavBar />
    <Scene key="SearchHomePage" component={SearchHomePage} hideNavBar />
    <Scene key="WardReceivePage" component={WardReceivePage} hideNavBar />
    <Scene key="MyWardsPage" component={MyWardsPage} hideNavBar />
    <Scene key="GameRulesPage" component={GameRulesPage} hideNavBar />
    <Scene key="SunnaInfoPage" component={SunnaInfoPage} hideNavBar />
    <Scene key="RecreationPage" component={RecreationPage} hideNavBar />
    <Scene key="ActivitiesPage" component={ActivitiesPage} hideNavBar />
    <Scene key="FastFoodPage" component={FastFoodPage} hideNavBar />
    <Scene key="RoundTripPage" component={RoundTripPage} hideNavBar />
    <Scene key="CouponInfoPage" component={CouponInfoPage} hideNavBar />
    <Scene key="CouponReceivePage" component={CouponReceivePage} hideNavBar />
    <Scene key="NewUserTask" component={NewUserTask} hideNavBar />
    <Scene key="InviteRulePage" component={InviteRulePage} hideNavBar />
    <Scene key="OtherInvitePage" component={OtherInvitePage} hideNavBar />
    <Scene key="UserInvitePage" component={UserInvitePage} hideNavBar />
    <Scene key="AwardDetailPage" component={AwardDetailPage} hideNavBar />
    <Scene key="InvitePage" component={InvitePage} hideNavBar />
    <Scene key="WalletDetailsPage" component={WalletDetailsPage} hideNavBar />
    <Scene key="Withdraw" component={Withdraw} hideNavBar />
    <Scene key="WalletPage" component={WalletPage} hideNavBar />
    <Scene key="LocalRatePage" component={LocalRatePage} hideNavBar />
    <Scene key="RatePage" component={RatePage} hideNavBar />
    <Scene key="CouponSelectPage" component={CouponSelectPage} hideNavBar />
    <Scene key="CouponPage" component={CouponPage} hideNavBar />
    <Scene key="IntegralInfoPage" component={IntegralInfoPage} hideNavBar />
    <Scene key="IntegralMallPage" component={IntegralMallPage} hideNavBar />
    <Scene key="ReturnHotelPage" component={ReturnHotelPage} hideNavBar />
    <Scene key="HotelOrderPage" component={HotelOrderPage} hideNavBar />
    <Scene key="OrderStatusPage" component={OrderStatusPage} hideNavBar />
    <Scene
      key="RoomReservationPage"
      component={RoomReservationPage}
      hideNavBar
    />
    <Scene key="HotelRoomListPage" component={HotelRoomListPage} hideNavBar />
    <Scene key="HotelListPage" component={HotelListPage} hideNavBar />
    <Scene key="SelectTimePage" component={SelectTimePage} hideNavBar />
    <Scene
      key="IntegralDetailsPage"
      component={IntegralDetailsPage}
      hideNavBar
    />
    <Scene key="IntegralPage" component={IntegralPage} hideNavBar />
    <Scene key="IntegralRulePage" component={IntegralRulePage} hideNavBar />
    <Scene key="InfoPage" component={InfoPage} hideNavBar />
    <Scene key="HotelDetail" component={HotelDetail} hideNavBar />
    <Scene key="HotelSearch" component={HotelSearch} hideNavBar />
    <Scene key="NearFriend" component={NearFriend} hideNavBar />
    <Scene key="MallPage" component={MallPage} hideNavBar />
    <Scene key="Square" component={Square} hideNavBar />
    <Scene key="ExpandText" component={ExpandText} hideNavBar />
    <Scene key="SocialContact" component={SocialContact} hideNavBar />
    <Scene key="Blacklist" component={Blacklist} hideNavBar />
    <Scene key="Location" component={Location} hideNavBar />
    <Scene key="UserTopicPage" component={UserTopicPage} hideNavBar />
    <Scene key="MoodRelease" component={MoodRelease} hideNavBar />
    <Scene key="LongArticle" component={LongArticle} hideNavBar />
    <Scene key="ArticleRelease" component={ArticleRelease} hideNavBar />
    <Scene key="ArticleList" component={ArticleList} hideNavBar />
    <Scene key="RecordList" component={RecordList} hideNavBar />
    <Scene
      key="SubscriptionInfoPage"
      component={SubscriptionInfoPage}
      hideNavBar
    />
    <Scene key="PokerB" component={PokerB} hideNavBar />
    <Scene key="RiskWarningPage" component={RiskWarningPage} hideNavBar />
    <Scene
      key="SubscriptionConfirmPage"
      component={SubscriptionConfirmPage}
      hideNavBar
    />
    <Scene key="SubscriptionPage" component={SubscriptionPage} hideNavBar />
    <Scene key="SelectPlayerPage" component={SelectPlayerPage} hideNavBar />
    <Scene key="PokerInfo" component={PokerInfo} hideNavBar />
    <Scene key="ReportPage" component={ReportPage} hideNavBar />
    <Scene key="CrowdDetail" component={CrowdDetail} hideNavBar />
    <Scene key="Crowdfunding" component={Crowdfunding} hideNavBar />
    <Scene key="DeletePage" component={DeletePage} hideNavBar />
    <Scene key="ReceivedReplyPage" component={ReceivedReplyPage} hideNavBar />
    <Scene key="CommentInfoPage" component={CommentInfoPage} hideNavBar />
    <Scene key="PersonDynamicPage" component={PersonDynamicPage} hideNavBar />
    <Scene key="WebPage" component={WebPage} hideNavBar />
    <Scene key="MallSelectPage" component={MallSelectPage} hideNavBar />
    <Scene key="LogisticsWeb" component={LogisticsWeb} hideNavBar />
    <Scene key="LogisticsPage" component={LogisticsPage} hideNavBar />
    <Scene key="MallOrderPage" component={MallOrderPage} hideNavBar />
    <Scene key="ReturnSucceedPage" component={ReturnSucceedPage} hideNavBar />
    <Scene key="ReturnPage" component={ReturnPage} hideNavBar />
    <Scene key="MallOrderInfo" component={MallOrderInfo} hideNavBar />
    <Scene key="SearchMallPage" component={SearchMallPage} hideNavBar />
    <Scene key="SearchVideo" component={SearchVideo} hideNavBar />
    <Scene key="RaceScene" component={RaceScene} hideNavBar />
    <Scene key="DrawerPage" component={DrawerPage} hideNavBar />
    <Scene key="AddVerified" component={AddVerified} hideNavBar />
    <Scene key="VerifiedPage" component={VerifiedPage} hideNavBar />
    <Scene key="HomePage" component={HomePage} hideNavBar />
    <Scene key="InputPwdPage" component={InputPwdPage} hideNavBar />
    <Scene key="PersonPage" component={PersonPage} hideNavBar />
    <Scene key="SettingPage" component={SettingPage} hideNavBar />
    <Scene key="RegisterPage" component={RegisterPage} hideNavBar />
    <Scene key="ForgetPage" component={ForgetPage} hideNavBar />
    <Scene key="LoginFirstPage" component={LoginFirstPage} hideNavBar />
    <Scene key="LoginCodePage" component={LoginCodePage} hideNavBar />
    <Scene key="EmailRegisterPage" component={EmailRegisterPage} hideNavBar />
    <Scene key="ImageGallery" component={ImageGallery} hideNavBar />
    <Scene key="ForgetEmailPage" component={ForgetEmailPage} hideNavBar />
    <Scene key="BuyTicketPage" component={BuyTicketPage} hideNavBar />
    <Scene key="OrderInfoPage" component={OrderInfoPage} hideNavBar />
    <Scene key="BuyKnowPage" component={BuyKnowPage} hideNavBar />
    <Scene key="CertificationPage" component={CertificationPage} hideNavBar />
    <Scene key="OrderListPage" component={OrderListPage} hideNavBar />
    <Scene key="SecurityPage" component={SecurityPage} hideNavBar />
    <Scene key="ModifyPwdPage" component={ModifyPwdPage} hideNavBar />
    <Scene key="SearchRacesPage" component={SearchRacesPage} hideNavBar />
    <Scene key="BusinessPage" component={BusinessPage} hideNavBar />
    <Scene key="SearchKeywordPage" component={SearchKeywordPage} hideNavBar />
    <Scene key="ChildRaceInfoPage" component={ChildRaceInfoPage} hideNavBar />
    <Scene key="AboutPage" component={AboutPage} hideNavBar />
    <Scene key="PokerPersonPage" component={PokerPersonPage} hideNavBar />
    <Scene key="MainNewsPage" component={MainNewsPage} hideNavBar />
    <Scene key="NewsInfoPage" component={NewsInfoPage} hideNavBar />
    <Scene key="SearchNewsPage" component={SearchNewsPage} hideNavBar />
    <Scene key="TicketPage" component={TicketPage} hideNavBar />
    <Scene key="ApiSettingPage" component={ApiSettingPage} hideNavBar />
    <Scene key="BindingPhonePage" component={BindingPhonePage} hideNavBar />
    <Scene key="ChangePhonePage" component={ChangePhonePage} hideNavBar />
    <Scene key="MessagePage" component={MessagePage} hideNavBar />
    <Scene key="MainVideoPage" component={MainVideoPage} hideNavBar />
    <Scene key="VideoInfoPage" component={VideoInfoPage} hideNavBar />
    <Scene key="TicketSearchPage" component={TicketSearchPage} hideNavBar />
    <Scene key="ChoiseTicketPage" component={ChoiseTicketPage} hideNavBar />
    <Scene key="TicketInfoPage" component={TicketInfoPage} hideNavBar />
    <Scene key="WebViewPage" component={WebViewPage} hideNavBar />
    <Scene key="NewAddressPage" component={NewAddressPage} hideNavBar />
    <Scene key="AdrListPage" component={AdrListPage} hideNavBar />
    <Scene key="DrawerRank" component={DrawerRank} hideNavBar />
    <Scene key="FocusPlayer" component={FocusPlayer} hideNavBar />
    <Scene key="PokerRankPage" component={PokerRankPage} hideNavBar />
    <Scene key="PokerRacePage" component={PokerRacePage} hideNavBar />
    <Scene key="SearchPoker" component={SearchPoker} hideNavBar />
    <Scene key="WebViewPay" component={WebViewPay} hideNavBar />
    <Scene key="Protocol" component={Protocol} hideNavBar />
    <Scene key="Suggest" component={Suggest} hideNavBar />
    <Scene key="WxRegister" component={WxRegister} hideNavBar />
    <Scene key="InputPwd" component={InputPwd} hideNavBar />
    <Scene key="MessageCenter" component={MessageCenter} hideNavBar />
    <Scene key="ActivityCenter" component={ActivityCenter} hideNavBar />
    <Scene key="ActivityInfo" component={ActivityInfo} hideNavBar />
    <Scene key="MallInfoPage" component={MallInfoPage} hideNavBar />
    <Scene key="ShoppingCart" component={ShoppingCart} hideNavBar />
    <Scene key="EmptyCart" component={EmptyCart} hideNavBar />
    <Scene key="MallSearchResult" component={MallSearchResult} hideNavBar />
    <Scene key="OrderSubmitPage" component={OrderSubmitPage} hideNavBar />
    <Scene key="ChatRoom" component={ChatRoom} hideNavBar />
    <Scene key="CameraVideo" component={CameraVideo} hideNavBar />

    <Scene key="Splash" component={Splash} hideNavBar initial={true} type={ActionConst.REPLACE}/>
    <Scene type={ActionConst.RESET} hideNavBar key="Main">
      {Navigation()}
    </Scene>
  </Scene>,
);
