import { reqCartList ,reqDeleteCartById,reqCartCheckedById} from "@/api";

const state = {
    cartList: []
}
const actions = {
    async getCartList({commit}) {
        let result = await reqCartList()
        if (result.code == 200) {
            commit('REQCARTLIST',result.data)
        }
    },
    //删除购物车某个商品
    async deleteCartListById({commit},skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code == 200) {
            return '成功删除'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //修改购物车商品勾选状态
    async changeCartCheckedById({ commit }, {skuId, isChecked}) {
        let result = await reqCartCheckedById(skuId, isChecked)
        if (result.code == 200) {
            return '勾选状态修改成功'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //删除选中状态的商品
    deleteCheckedShopCart({ dispatch, getters }) {
        //context为当前小仓库,可以支持仓库内actions向当前仓库内actions的其他函数派发dispatch
        let PromiseAll = []
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListById', item.skuId) : ''
            PromiseAll.push(promise)
        });
        return Promise.all(PromiseAll)
        //promsie都成功时才会返回成功，如果有一个失败，随机返回失败
    },
    //全选商品勾选状态(全选然后再通过changeCartCheckedById修改每一个商品勾选状态)
    updateAllCartChecked({ state, dispatch }, isChecked) {
        let promiseAll = []
        state.cartList[0].cartInfoList.forEach((item) => {
            let promise = dispatch('changeCartCheckedById', { skuId: item.skuId, isChecked })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
}
const mutations = {
    REQCARTLIST(state,cartList) {
        state.cartList = cartList
    }
}
const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}