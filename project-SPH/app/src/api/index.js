//当前这个模块，API统一管理
import requests from './request'
import mockRequest from './mockRequest'

//三级联动接口
//  /api/product/getBaseCategoryList
//axios发请求后返回的结果是一个promise对象
export const reqCategoryList = () => requests({
    // 注意之前request中配置过baseURL: "/api",所以这里就不加了
    url: '/product/getBaseCategoryList',
    //这个是后端提前配置好的地址，前端工程师在服务器的这个地方拿到自己想要的数据
    method:'get'
})

export const reqGetBannerList = () => mockRequest({
    // 注意之前mockRequest中配置过baseURL: "/mock",所以这里就不加了
    url: '/banner',
    method:'get'
})

export const reqGetFloorList = () => mockRequest({
    // 注意之前mockRequest中配置过baseURL: "/mock",所以这里就不加了
    url: '/floor',
    method:'get'
})

export const regGetSearchInfo = (params) => requests({
    url: './list',
    method: 'post',
    data: params
    //这里带上这个params是因为没有配置这个空对象无法成功请求服务器并返回数据
})

export const regGetGoodsInfo = (skuId) => requests({
    url: `/item/${skuId}`,
    method:'get'
})

//将产品添加购物车中，将产品ID，数量告知服务器
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method:'post'
})

//获取购物车数据
export const reqCartList = () => requests({
    url: `/cart/cartList`,
    method:'get'
})

//删除购物车
export const reqDeleteCartById = (skuId) => requests({
    url: `/cart/deleteCart/${skuId}`,
    method:'DELETE'
})

//修改商品勾选状态
export const reqCartCheckedById = (skuID, isChecked) => requests({
    url: `/cart/checkCart/${skuID}/${isChecked}`,
    method:'get'
})

//获取注册手机验证码
export const reqGetUsersPassport = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method:'get'
})

//注册账号
export const reqUserRegister = (data) => requests({
    url: `/user/passport/register`,
    data,
    method:'POST'
})

//登录账号
export const reqUserLogin = (data) => requests({
    url: `/user/passport/login`,
    data,
    method:'POST'
})

//登录成功后获取用户信息
//又因为接口这里没有携带服务器辨别用户身份的身份令牌token，所以将token放到请求头中
export const reqGetUserInfo = () => requests({
    url: '/user/passport/auth/getUserInfo',
    method:'get'
})

//退出登录
export const reqUserLogout = () => requests({
    url: '/user/passport/logout',
    method:'GET'
})

//获取用户地址信息
export const reqUserAddress = () => requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method:'get'
})

//获取订单交易页信息
export const reqUserOrderList = () => requests({
    url: '/order/auth/trade',
    method:'get'
})

//提交订单信息
export const reqSubmitOrder = (tradeNo, data) => requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method:'POST'
})

//获取支付信息
export const reqPayInfo = (orderId) => requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method:'get'
})

//获取订单支付状态
export const reqPayState = (orderId) => requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method:'GET'
})

//获取个人中心数据
export const reqMyOrderList = (page, limit) => requests({
    url: `/order/auth/${page}/${limit}`,
    method:'GET'
})