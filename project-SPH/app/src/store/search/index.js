import { regGetSearchInfo } from '@/api/index'

const state = {
    searchList: {},
    // attrsList: {},
    // trademarkList:{}
}

const actions = {
    async getGetSearchInfo({ commit }, params = {}) {
        // 请求时至少传递一个空对象，否则会请求失败
        let result = await regGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHINFO',result.data)
        }
    }
}
const mutations = {
    GETSEARCHINFO(state,searchList) {
        state.searchList = searchList
    }
}
const getters = {
    goodsList(state) {
        return state.searchList.goodsList
    },
    attrsList(state) {
        return state.searchList.attrsList
    },
    trademarkList(state) {
        return state.searchList.trademarkList
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}