import { regGetGoodsInfo, reqAddOrUpdateShopCart } from '@/api/index'
import {getUUID} from '@/utils/uuid_token'
const state = {
    goodInfo: {},
    //游客的临时身份
    uuid_token:getUUID()
}
const actions = {
    async getGoodinfo({ commit }, skuid) {
        //这里的skuid是需要请求数据时获取，并传过来
        let result = await regGetGoodsInfo(skuid)
        if (result.code == 200) {
            commit('GETGOODSINFO', result.data)
        }
    },
    //通过商品id，数量获取购物车信息
    async reqAddOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)

        if (result.code == 200) {
            return '服务器收到请求数据，并且可行'
        } else {
            //加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    }
}
const mutations = {
    GETGOODSINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const getters = {
    //路径导航简化信息
    categoryView(state) {
        return state.goodInfo.categoryView || {}
        //这里后面或一个||是因为在请求没回来之间，前面的东西是一个undefined，会报错
    },
    //产品信息简化
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    //售卖属性简化
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}
export default {
    state,
    actions,
    mutations,
    getters
    // 注意写完小仓库要在大仓库中进行合并
}