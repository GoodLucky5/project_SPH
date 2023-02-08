import {reqCategoryList,reqGetBannerList,reqGetFloorList} from '@/api/index'

const state = {
    categoryList: [],
    bannerList: [],
    floorList:[]
}
const actions = {
    //通过调用API里面的接口函数，向服务器发送请求，获取服务器的数据
    async categoryList({commit}) {
        let result = await reqCategoryList()
        //如果成功获取到数据并返回
        if (result.code === 200) {
            commit('CATEGORYLIST',result.data)
        }
    },
    async getBannerList({ commit }) {
        let result = await reqGetBannerList()
        console.log(result);
        //如果成功获取到数据并返回
        if (result.code === 200) {
            commit('GETBANNERLIST',result.data)
        }
    },
    async getFloorList({ commit }) {
        let result = await reqGetFloorList()
        console.log(result);
        //如果成功获取到数据并返回
        if (result.code === 200) {
            commit('GETFLOORLIST',result.data)
        }
    },
}
const mutations = {
    CATEGORYLIST(state,categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state,bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state,floorList) {
        state.floorList = floorList
    },
}
const getters = {}

export default {
    state,
    actions,
    mutations,
    getters
}