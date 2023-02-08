import { reqUserAddress, reqUserOrderList } from '@/api/index'

const state = {
    address: [],
    //订单交易页信息
    orderInfo:{}
}
const actions = {
    //获取用户地址信息
    async getUserAddress({ commit }) {
        let result = await reqUserAddress()
        if (result.code == 200) {
            commit('GETUSERADDRESS', result.data)
            return '成功获取地址'
        } else {
            return Promise.reject(new Error('获取地址失败'))
        }
    },
    //获取订单交易页信息
    async reqUserOrderList({ commit }) {
        let result = await reqUserOrderList()
        if (result.code == 200) {
            commit('GETUSERORDERLIST', result.data)
            console.log(result.data);
            return '成功订单交易信息'
        } else {
            return Promise.reject(new Error('获取订单交易信息失败'))
        }
    }
}
const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address
    },
    GETUSERORDERLIST(state, order) {
        state.orderInfo = order
    }
}
const getters = {}

export default {
    state, actions, mutations, getters
}