/**
 * Created by lorne on 2016/12/20.
 */
import {LoginUser} from '../services/AccountDao';
import {strNotNull, isEmptyObject, logMsg} from '../utils/ComonHelper';
import {invite_count} from "../services/WallDao";
import md5 from "react-native-md5";

const api = {
    //内部测试
    dev: 'http://192.168.2.10:3000/v1/',
    dev_ci_at: 'http://192.168.2.10:8801/v10/',

    //test分支用来发布版本  test_ci_at用来跑自动化测试
    test: 'http://test.kkapi.deshpro.com/v1/',
    test_ci_at: 'http://106.75.134.18:8801/v10/',

    //production 用来发布正式生产环境
    staging: 'http://106.75.136.9:8801/v10/',
    production: 'https://kkapi.deshpro.com/v1/',

    register: 'account/register',
    login: 'account/login',
    account_profile: putProfile,
    upload_avatar: upload_avatar,
    account_verify: 'account/verify_vcode',
    account_reset_password: 'account/reset_password',
    account_change_pwd: postChangePwd,
    recent_races: recent_races,
    v_codes: 'account/v_codes',
    races_info: races_info,

    new_order: new_order,
    ticket_status: ticket_status,
    buyTicket: buyTicket,
    certification: certification,
    upload_card_image: 'uploaders/card_image',
    users_orderList: users_orderList,
    users_orderDetail: users_orderDetail,
    users_orderCancel: users_orderCancel,
    search_races: search_races,
    search_by_date: search_by_date,
    search_by_keyword: search_by_keyword,
    search_range_list: search_range_list,
    sub_races: sub_races,
    race_ranks: race_ranks,
    sub_race_info: sub_race_info,
    player_info: player_info,
    news_types: 'news/types',
    news_list: news_list,
    news_search: news_search,
    race_hosts: 'race_hosts',
    race_tickets: race_tickets,
    account_change_bind: account_change_bind,
    bind_account: bind_account,
    change_permission: change_permission,
    notifications: notifications,
    videoTypes: 'videos/types',
    videoList: videoList,
    searchVideo: searchVideo,
    delNotice: delNotice,
    selectRaceTicket: selectRaceTicket,
    buyRaceTicket: buyRaceTicket,
    orderTicket: orderTicket,
    addAddress: 'account/address',
    setAdrDefault: setAdrDefault,
    adrDelete: adrDelete,
    login_count: login_count,
    players_list: players_list,
    poker_ranks: poker_ranks,
    player_focus: player_focus,
    focus_list: focus_list,
    pay_order: pay_order,
    order_complete: order_complete,
    unpaid_order: unpaid_order,
    feedbacks: 'feedbacks',
    wx_pay: wx_pay,
    weixin_auth: 'weixin/auth',
    weixin_bind: 'weixin/bind',
    account_exist: account_exist,
    activities: 'activities',
    activityInfo: activityInfo,
    activityPush: 'activities/pushed',
    verify_invite_code: verify_invite_code,
    msg_read: msg_read,
    unread_remind: unread_remind,
    app_versions: 'app_versions',
    add_certification: 'account/certification',//新增用户实名认证
    list_certification: list_certification,
    cert_default: cert_default,
    test_user: 'account/test_user',
    preferential: preferential,
    banners: 'banners',
    headlines: 'headlines',
    hot_infos: 'hot_infos',
    info_detail: info_detail,
    video_detail: video_detail,
    sub_videos: sub_videos,
    search_video: search_video,
    categories: 'shop/categories',
    categories_child: categories_child,
    cat_products: cat_products,
    products: 'shop/products',
    product_detail: product_detail,
    product_orders: product_orders,
    mall_order: 'shop/orders',
    mall_wxPay: mall_wxPay,
    shop_orders: 'shop/orders',
    mall_order_cancel: mall_order_cancel,
    wx_paid_result: wx_paid_result,
    product_order_detail: product_order_detail,
    product_order_confirm: product_order_confirm,
    logistics_info: logistics_info,
    refund_types: 'refund_types',
    upload_temp_img: 'uploaders/tmp_image',
    mall_refund: mall_refund,
    refund_info: refund_info,
    topic_comments: 'topic/comments',
    comment_replies: 'replies',
    replies_replies: replies_replies,
    replies_comments: replies_comments,//查看回复
    new_likes: new_likes,
    person_dynamics: person_dynamics,
    person_reply: person_reply,
    delete_comment: delete_comment,
    delete_reply: delete_reply,
    unread_comments: unread_comments,//查看回复未读数量
    crowdfundings: 'crowdfundings',//获取众筹列表
    crowd_detail: crowd_detail,//获取众筹详情
    poker_list: poker_list,//查看某个众筹牌手列表
    poker_info: poker_info,//查看某个众筹牌手详情
    crowdfunding_orders: 'crowdfunding_orders',//生成众筹订单
    crowdfunding_banners: 'crowdfunding_banners',//获取众筹banner
    poker_coins: 'poker_coins',//获取扑客币交易详情
    user_crowd_orders: 'crowdfunding_orders',//用户赞助订单记录列表
    get_crowd_info: get_crowd_info,//查看某个赞助详情
    del_crowd_info: del_crowd_info,//删除某个赞助详情
    crowd_order_wx: crowd_order_wx,//对众筹商品调起微信支付
    crowd_wx_result: crowd_wx_result,//获取众筹的微信支付结果
    timely_match: timely_match,//及时赛报
    player_match: player_match,//牌手赛报
    crowd_user_count: crowd_user_count,//获取用户历史购买份数
    releases_show: 'releases',//功能开启或隐藏控制
    poker_coins_discount: 'poker_coins/numbers',//获取用户扑客币数量和以及扑客币对应折扣
    release_topic: release_topic,//发说说/长帖的接口
    upload_image: "topics/image",//长贴上传图片
    topics: 'topics',//获取广场列表
    topics_recommends: '/topics/essence', //获取精华列表
    topics_like: topics_like,//说手长帖点赞
    topics_detail: topics_detail,//查看帖子详情
    comments: 'comments',//获取说说长帖评论列表
    jmessage_info: jmessage_info,//极光IM用户登录
    topics_image: topics_image,//上传话题相关的图片
    followships: followships,//获取关注及粉丝列表
    followings: followings,//获取关注列表
    followers: followers,//获取粉丝列表
    user_topics: user_topics,//获取用户个人动态(说说和长帖)¶
    topics_delete: topics_delete,//删除说说或长帖
    topics_search: topics_search,//获取用户的说说或长帖¶
    jmessage_visit_other: jmessage_visit_other,//极光IM访问其它用户
    profile: profile,//获取其他用户信息
    my_focus: my_focus,//获取长帖／说说列表（关注）
    nearbys: nearbys,//更新个人位置
    locations: 'locations',//获取附近位置
    report_templates: 'report_templates',//获取举报模板
    report_user: report_user,//举报用户
    reports: 'reports',//举报长帖说说
    hotels: 'hotels',//获取酒店列表
    info_types: info_types,//获取资讯列表
    infos: 'infos',//获取资讯详情
    exchange_rates: exchange_rates,//获取汇率列表
    recommends: 'recommends',//首页推荐
    integral_task: integral_task,//用户任务列表
    integral_detail: integral_detail,//用户积分明细
    integral_award: integral_award,//用户积分领取
    room_list: room_list,//获取酒店房间列表
    room_reservation: 'hotel_orders/new',//获取酒店下单界面所需的数据
    hotel_order: 'hotel_orders',//创建酒店订单
    hotel_order_info: hotel_order_info,//获取酒店订单详情
    hotel_wxPay: hotel_wxPay,//微信支付 - 酒店订单
    hotel_wx_paid_result: hotel_wx_paid_result,//获取酒店订单的微信支付结果
    hotel_order_cancel: hotel_order_cancel,//取消酒店订单
    del_order_hotel: del_order_hotel,//删除酒店订单
    hotel_return: hotel_return,//酒店订单退款
    alipay: alipay,//支付宝支付 - 酒店订单
    integral_mall: 'integral_malls/coupons',// 积分商城优惠券列表
    integral_coupon: integral_coupon,// 积分商城优惠券列表返回三条数据
    person_coupons: person_coupons,//用户已获得优惠券列表
    hotel_aliPay: hotel_aliPay,//支付宝支付 - 酒店订单
    exchange_coupon: exchange_coupon,//积分兑换优惠券
    share_count: share_count,//用户分享统计(会产生积分)
    using_coupon: using_coupon,//用户订单可用优惠券
    integral_info: integral_info,//优惠券详情
    exchange_traders: 'exchange_traders',//获取换汇人列表
    wallet_account: 'wallet/account',//获取用户钱包余额
    account_details: 'wallet/account_details',//获取用户钱包交易明细
    display_check: 'my_invites/display_check',//用户主页是否显示我的邀请
    award_details: 'my_invites/award_details',//获取用户邀请奖励明细
    invite_count: 'my_invites/count',//获取用户邀请奖励明细
    user_invite: 'my_invites',//查看某个用户邀请的用户 [只有1级和2级用户有权限
    other_invite: 'my_invites/indirect',//查看某个用户间接邀请的用户 [只有1级用户有权限]
    withdrawal: 'wallet/withdrawal',//用户钱包账户提现
    novice_task: novice_task,//获取新手红包任务进度
    info_coupons: info_coupons,//获取咨询中的优惠券列表
    receive_coupons: receive_coupons,//领取优惠券
    coupons_infos: coupons_infos,//获取优惠券详情
    hotlines: 'hotlines',//服务热线电话列表
    contacts: 'contacts',//公司联系方式'
    saunas: 'saunas',//获取桑拿列表
    sunna_detail: sunna_detail,//获取桑拿详情
    all_infos: all_infos,//资讯全局搜索
    elements: elements,//获取转盘元素
    lottery: lottery,//转盘开始抽奖
    wheel_time: wheel_time,//转盘剩余抽奖次数
    prize_messages: prize_messages,//转盘轮播提示用户的中奖信息
    prizes_list: prizes_list,//转盘活动我的奖品列表
    task_count: task_count,//转盘剩余抽奖次数，用户积分剩余情况
    post_wheel_times: post_wheel_times,//积分兑换转盘次数的接口
    location_ios: location_ios,//ios定位
    prizes_info: prizes_info,//奖品详情
    access_permission: 'saunas/access_permission',//检查是否可访问桑拿的接口
    home_img: 'sets',//获取app的设置参数
    win_history: 'wheel/prize_messages/history',//转盘中奖历史回顾
    favorites_list: favorites_list,//获取用户收藏列表
    post_favorites: post_favorites,//用户收藏某个话题
    post_cancel_favorites: post_cancel_favorites,//用户取消收藏某个话题
}

export default api;

const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateMixed(n) {
    let res = "";
    for (let i = 0; i < n; i++) {
        let id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}

function rstr2b64(input) {
    try {
        b64pad
    } catch (e) {
        b64pad = '';
    }
    let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let output = "";
    let len = input.length;
    for (let i = 0; i < len; i += 3) {
        let triplet = (input.charCodeAt(i) << 16)
            | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
            | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (let j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
        }
    }
    return output;
}


function getUserId() {
    if (!isEmptyObject(global.login_user) && strNotNull(global.login_user.user_id)) {
        return login_user.user_id;
    }
    return '0';
}

function getSignature_str() {
    let timestamp = Date.parse(new Date());
    // logMsg("时间戳：", timestamp);
    let random_str = generateMixed(6);
    // logMsg("随机数：", random_str);
    let token = "desh2019";
    let signature_str = `timestamp=${timestamp}&random_str=${random_str}&token=${token}`;
    // logMsg("signature_str：", signature_str);
    let signature_md501 = md5.hex_md5(signature_str);
    // logMsg("signature_md501：", signature_md501);
    let signature_md5 = md5.hex_md5(`desh${signature_md501}`);
    // logMsg("signature_md5：", signature_md5);
    let signature = signature_md5.toUpperCase();
    // logMsg("signature：", signature);
    let str = `timestamp=${timestamp}&random_str=${random_str}&signature=${signature}`;
    // logMsg("str：", str);
    return str;
}

export function post_cancel_favorites() {
    return `users/${getUserId()}/favorites/cancel`
}

export function post_favorites() {
    return `users/${getUserId()}/favorites`
}

export function favorites_list() {
    return `users/${getUserId()}/favorites`
}

export function alipay(order_number) {
    return `shop/orders/${order_number}/alipay`
}

const page_size = 10;

export function location_ios(body) {
    const {latitude, longitude} = body;
    return `http://restapi.amap.com/v3/geocode/regeo?key=67d1f5cf8475c8db0ac8524878046f1e&location=${longitude},${latitude}`;
}

export function post_wheel_times() {
    return `wheel/times`;
}

export function task_count() {
    return `wheel/task_count`;
}

export function prizes_info(body) {
    const {prize_id} = body;
    return `wheel/user_prizes/${prize_id}`;
}

export function prizes_list() {
    return `wheel/user_prizes`;
}

export function prize_messages() {
    return `wheel/prize_messages`;
}

export function wheel_time() {
    return `wheel/times`;
}

export function lottery() {
    return `wheel/lotteries/?${getSignature_str()}`;
}

export function elements() {
    return `wheel/elements`;
}

export function all_infos() {
    return `infos/all`;
}

export function sunna_detail(body) {
    const {id} = body;
    return `saunas/${id}`;
}

export function coupons_infos(body) {
    const {coupon_number} = body;
    return `account/users/${getUserId()}/coupons/${coupon_number}`;
}

export function receive_coupons(body) {
    const {id} = body;
    return `infos/${id}/receive_coupon`;
}


export function info_coupons(body) {
    const {id} = body;
    return `infos/${id}/coupons`;
}

export function novice_task() {
    return `account/users/${getUserId()}/novice_task`;
}

export function replies_comments(body) {

    const {comment_id} = body;
    return `comments/${comment_id}/replies`;
}

export function exchange_rates(body) {
    return `exchange_rates`
}

export function integral_info(body) {
    const {id} = body;
    return `integral_malls/coupons/${id}`
}

export function integral_coupon(body) {
    const {page_size} = body;
    return `integral_malls/coupons?page_size=${page_size}`
}

export function using_coupon(body) {
    const {amount} = body;
    return `users/${getUserId()}/coupons/search?coupons_type=hotel&amount=${amount}`
}

export function share_count(body) {
    return `users/${getUserId()}/share_count?${getSignature_str()}`
}

export function exchange_coupon(body) {
    const {coupon_id} = body;
    return `integral_malls/coupons/${coupon_id}/exchange`
}

export function person_coupons(body) {
    return `account/users/${getUserId()}/coupons`
}

//酒店支付宝
export function hotel_aliPay(order_number) {
    return `hotel_orders/${order_number}/alipay`
}

export function hotel_return(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}/refund`
}

export function del_order_hotel(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}`
}

export function hotel_order_cancel(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}/cancel`
}

export function hotel_wx_paid_result(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}/wx_paid_result`
}


export function hotel_wxPay(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}/wx_pay`;
}

function room_list(body) {
    const {begin_date, id} = body;
    return `hotels/${id}/rooms?date=${begin_date}`
}

function hotel_order_info(body) {
    const {order_number} = body;
    return `hotel_orders/${order_number}`
}

function integral_award() {
    return `account/users/${getUserId()}/integral/award`
}

function integral_detail() {
    return `account/users/${getUserId()}/integral/details`
}

function integral_task() {
    return `account/users/${getUserId()}/integral/tasks`
}

function info_types(body) {
    return `info_types/${body.type}/infos`
}

function upload_avatar() {
    return `account/users/${getUserId()}/avatar`
}

function report_topic(topicId) {
    return `topic/user_topics/${topicId}/report`

}

function report_user() {
    return `users/${getUserId()}/im/report`

}

function nearbys() {
    return `users/${getUserId()}/nearbys`
}

function my_focus() {
    return `users/${getUserId()}/user_topics/my_focus`
}

function profile(user_id) {
    return `users/${user_id}/profile`
}

function jmessage_visit_other(body) {
    const {userId} = body;
    return `users/${userId}/jmessage`
}


function topics_search(user_id) {
    return `users/${user_id}/topics`
}

function topics_delete(topic_id) {
    return `topics/${topic_id}`
}

function user_topics(body) {
    const {user_id} = body;
    return `users/${user_id}/topics`
}

function jmessage_info() {
    return `users/${login_user.user_id}/jmessage`
}

function followships() {
    return `users/${login_user.user_id}/following`
}

function followings() {
    return `users/${login_user.user_id}/following`
}

function followers() {
    return `users/${login_user.user_id}/followers`
}

function topics_image(topic_id) {
    return `topic/user_topics/${topic_id}/image`
}


function topics_like() {
    return `users/${getUserId()}/likes`
}


function topics_detail(topic_id) {
    return `topics/${topic_id}`
}

function release_topic() {
    return `topics`
}

function crowd_user_count(body) {
    const {crowdfunding_id, crowdfunding_player_id} = body;
    return `crowdfundings/${crowdfunding_id}/players/${crowdfunding_player_id}/user_order_count`
}


function player_match(body) {
    const {cf_id, cf_player_id} = body;

    return `crowdfundings/${cf_id}/players/${cf_player_id}/reports`
}

function crowd_wx_result(body) {
    const {order_number} = body;
    return `crowdfunding_orders/${order_number}/wx_paid_result`
}

function timely_match(body) {
    const {crowdfunding_id} = body;
    return `crowdfundings/${crowdfunding_id}/reports`

}

function crowd_order_wx(body) {
    const {order_number} = body;
    return `crowdfunding_orders/${order_number}/wx_pay`
}


function del_crowd_info(body) {
    const {order_number} = body;
    return `crowdfunding_orders/${order_number}`;
}

function get_crowd_info(body) {
    const {order_number} = body;
    return `crowdfunding_orders/${order_number}`;
}

function poker_coins(body) {
    const {page} = body;
    return `poker_coins?page=${page}&page_size=${page_size}`;
}

function poker_info(body) {
    const {id, player_id} = body;
    return `crowdfundings/${id}/players/${player_id}`;
}

function poker_list(body) {
    const {id} = body;
    return `crowdfundings/${id}/players`;
}

function crowd_detail(body) {
    const {id} = body;
    return `crowdfundings/${id}`
}

function unread_comments(body) {
    const {user_id} = body;
    return `topic_notifications/unread_count`;
}

function delete_reply(body) {
    const {comment_id, id} = body;
    return `topic/comments/${comment_id}/replies/${id}`;
}

function delete_comment(body) {
    const {comment_id} = body;
    return `topic/comments/${comment_id}`;
}

export function person_reply(body) {
    return `topic_notifications`;
}

export function person_dynamics(body) {
    const {user_id, page, page_size} = body;

    return `users/${user_id}/dynamics?page=${page}&page_size=${page_size}`;
}

export function new_likes(body) {
    const {info_id, topic_type} = body;

    return `topic/${topic_type}/${info_id}/likes`;
}

export function replies_replies(body) {
    const {comment_id, reply_id} = body;
    return `topic/comments/${comment_id}/replies/${reply_id}/replies`
}


export function refund_info(body) {
    const {refund_number} = body;
    return `refund/${refund_number}/refund_record`
}


export function mall_refund(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/customer_return`
}

export function logistics_info(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/express_tracking`;
}

export function product_order_confirm(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/confirm`
}

export function product_order_detail(body) {
    const {order_number} = body;
    return `${api.shop_orders}/${order_number}`
}

export function wx_paid_result(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/wx_paid_result`
}

export function mall_order_cancel(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/cancel`
}

export function order_lists(body) {
    return `shop/orders`
}

export function mall_wxPay(body) {
    const {order_number} = body;
    return `shop/orders/${order_number}/wx_pay`
}

export function product_detail(body) {
    return `shop/products/${body.id}`

}

export function product_orders() {
    return `shop/orders/new`

}

export function cat_products(body) {
    const {id} = body;
    if (id === -1)
        return 'shop/products/recommended';//推荐
    else
        return `shop/products`
}

export function categories_child(body) {
    const {id} = body;
    return `shop/categories/${id}/children`;
}

export function search_video(body) {
    const {keyword, next_id} = body;

    return `videos/search_main_videos?keyword=${keyword}&next_id=${next_id}&page_size=${page_size}`
}

export function sub_videos(body) {
    const {group_id} = body;
    return `videos/group/${group_id}/sub_videos`
}

export function video_detail(body) {
    const {video_id} = body;
    return 'news/videos/' + video_id;
}

export function info_detail(body) {
    const {info_id} = body;
    return 'news/infos/' + info_id;
}

export function preferential(body) {
    const {race_id} = body;
    return 'races/' + race_id + '/tickets/preferential'
}

export function cert_default(body) {
    return `account/certification/${body.id}/default`
}


export function list_certification() {
    return 'account/certification'
}


export function unread_remind() {
    return 'users/' + getUserId() + '/notifications/unread_remind';
}


export function msg_read(body) {
    const {id} = body;
    return 'users/' + getUserId() + '/notifications/' + id + '/read';
}


export function verify_invite_code() {
    return 'users/' + getUserId() + '/verify_invite_code'
}

export function activityInfo(body) {
    const {id} = body;
    return 'activities/' + id;
}

export function account_exist() {
    return 'account/verify'
}

export function wx_pay(body) {
    const {order_number} = body;
    return 'users/' + getUserId() + '/orders/' + order_number + '/wx_pay';
}

export function unpaid_order(body) {
    const {race_id, ticket_id} = body;
    return 'races/' + race_id + '/tickets/' + ticket_id + '/unpaid_order'

}

export function order_complete(body) {
    const {order_number} = body;
    return 'users/' + getUserId() + '/orders/' + order_number + '/complete';
}

export function pay_order(body) {
    const {order_number} = body;
    return 'users/' + getUserId() + '/orders/' + order_number + '/pay';
}

export function player_focus(body) {
    const {player_id} = body;
    return 'players/' + player_id + '/follow'
}

export function login_count() {
    return 'users/' + getUserId() + '/login_count';
}


export function adrDelete(address_id) {
    return 'account/address/' + address_id;
}

export function setAdrDefault(address_id) {
    return 'account/address/' + address_id + '/default';
}

export function addAddress() {
    return 'account/users/' + getUserId() + '/address';
}

export function orderTicket(body) {
    const {race_id, ticket_id} = body;
    return 'races/' + race_id + '/tickets/' + ticket_id + '/orders';
}


export function buyRaceTicket(body) {
    const {race_id, ticket_id} = body;
    return 'races/' + race_id + '/tickets/' + ticket_id;
}

export function selectRaceTicket(body) {
    const {race_id} = body;
    return 'races/' + race_id + '/tickets';
}

export function delNotice(body) {
    const {id} = body;
    return 'users/' + login_user.user_id + '/notifications/' + id;

}

export function searchVideo(body) {
    const {keyword, next_id} = body;
    return 'videos/search?keyword=' + keyword + '&next_id=' + next_id
}

export function videoList(body) {
    const {type_id, next_id} = body;
    return 'videos/types/' + type_id + '/main_lists?page_size=' + page_size + '&next_id=' + next_id
}


export function notifications() {
    return 'users/' + login_user.user_id + '/notifications';
}


export function change_permission() {
    return 'account/users/' + login_user.user_id + '/change_permission';
}


export function bind_account() {
    return 'account/users/' + login_user.user_id + '/bind_account';
}

export function account_change_bind() {
    return 'account/users/' + login_user.user_id + '/change_account'
}

export function race_tickets(body) {
    const {keyword, seq_id} = body;
    let url = '';
    if (strNotNull(keyword)) {
        url = '&keyword=' + keyword;
    }
    if (strNotNull(seq_id))
        url = url + '&seq_id=' + seq_id;

    return 'race_tickets?page_size=' + page_size + url;
}

export function news_search(body) {
    const {keyword, next_id} = body;

    return 'news/search?keyword=' + keyword + '&next_id=' + next_id;
}

export function news_list(body) {

    const {type_id, next_id} = body;

    return 'news/types/' + type_id + '?page_size=' + page_size + '&next_id=' + next_id;
}

export function players_list(body) {
    const {page_index, region, page_size, begin_year, end_year, keyword} = body;
    if (strNotNull(keyword))
        return 'players?keyword=' + keyword;
    else
        return 'players?page_index=' + page_index + '&page_size=' + page_size
            + '&region=' + region + '&begin_year=' + begin_year + '&end_year=' + end_year;
}

export function player_info(body) {
    const {player_id} = body;
    return 'players/' + player_id;
}

export function poker_ranks(body) {
    const {player_id} = body;
    return 'players/' + player_id + '/ranks';
}

export function focus_list(body) {
    const {next_id} = body;
    return 'users/' + getUserId() + '/followed_players?next_id=' + next_id
}

export function sub_race_info(body) {
    const {race_id_1, race_id_2} = body;
    return 'races/' + race_id_1 + '/sub_races/' + race_id_2;
}


export function race_ranks(body) {
    const {race_id} = body;
    return 'races/' + race_id + '/race_ranks';
}

export function sub_races(body) {
    const {race_id, type} = body;
    if (strNotNull(type))
        return 'races/' + race_id + '/sub_races?type=' + type;
    else
        return 'races/' + race_id + '/sub_races';
}

export function search_range_list(body) {
    const {begin_date, end_date} = body;
    return 'u/' + getUserId() + '/races/search_range_list?begin_date='
        + begin_date + '&end_date=' + end_date
}

export function search_by_keyword(body) {
    const {keyword, next_id} = body;
    return 'u/' + getUserId() + '/races/search_by_keyword?keyword='
        + keyword + '&next_id=' + next_id + '&page_size=' + page_size;
}

export function search_by_date(body) {
    const {date, next_id} = body;
    return 'u/' + getUserId() + '/races/search_by_date?date='
        + date + '&next_id=' + next_id + '&page_size=' + page_size;

}


export function search_races(body) {

    console.log('search_race', body);
    const {seq_id, operator, host_id, date} = body;
    if (!isEmptyObject(login_user) && strNotNull(login_user.user_id)) {

        return '/u/' + login_user.user_id + '/races?page_size='
            + page_size + '&seq_id=' + paramCheck(seq_id) + '&operator=' + paramCheck(operator)
            + '&host_id=' + paramCheck(host_id) + '&date=' + paramCheck(date);

    } else {
        return '/u/0/races?page_size='
            + page_size + '&seq_id=' + paramCheck(seq_id) + '&operator=' + paramCheck(operator)
            + '&host_id=' + paramCheck(host_id) + '&date=' + paramCheck(date);

    }

}

function paramCheck(param) {
    return strNotNull(param) ? param : '';
}


export function putProfile(user_id) {
    return 'account/users/' + getUserId() + '/profile';
}

function postChangePwd() {
    return 'account/users/' + LoginUser.user_id + '/change_password';
}

function recent_races(body) {
    const {number} = body;
    if (strNotNull(number)) {
        return 'u/' + getUserId() + '/recent_races?numbers=' + number;
    } else {
        return 'u/0/recent_races';
    }
}


function races_info(body) {
    const {user_id, race_id} = body;
    return 'u/' + getUserId() + '/races/' + race_id;
}

function new_order(race_id) {
    return 'races/' + race_id + '/new_order'
}

function ticket_status(race_id) {
    return 'races/' + race_id + '/ticket_status'
}

function buyTicket(race_id) {
    return 'races/' + race_id + '/orders'
}

function certification(user_uuid) {
    return 'account/users/' + user_uuid + '/certification'
}

function users_orderList(body) {
    const {user_id, page_size, next_id, status} = body;
    return 'users/' + user_id + '/orders?page_size='
        + page_size + '&next_id=' + next_id + '&status=' + status;

}

function users_orderDetail(body) {
    const {user_id, order_id} = body;
    return 'users/' + user_id + '/orders/' + order_id;
}

function users_orderCancel(body) {
    const {user_id, order_id} = body;
    return 'users/' + getUserId() + '/orders/' + order_id + '/cancel';
}


