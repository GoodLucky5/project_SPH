//这个是登录和注册的仓库
import { reqGetUsersPassport, reqUserRegister, reqUserLogin, reqGetUserInfo, reqUserLogout } from '@/api/index'
import { setToken, userLogout } from '@/utils/token'
const state = {
    code: '',
    token: localStorage.getItem('TOKEN'),
    // token: localStorage.getItem('TOKEN'),
    userInfo: {}
}
const actions = {
    //获得注册验证码
    async getUsersPassport({ commit }, phone) {
        let result = await reqGetUsersPassport(phone)
        if (result.code == 200) {
            commit('GETUSERSPASSPORT', result.data)
            return '成功申请到注册验证码'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //注册用户
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user)
        if (result.code == 200) {
            return '注册成功'
        } else {
            return Promise.reject(new Error('注册失败'))
        }
    },
    //用户登录
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        if (result.code == 200) {
            commit('USERLOGIN', result.data.token);
            setToken(result.data.token);
            // setToken(result.data.token)
            return '登录成功'
        } else {
            return Promise.reject(new Error('登录失败'))
        }
    },
    //用户登录获取用户信息
    async getUserInfo({ commit }) {
        let result = await reqGetUserInfo()
        if (result.code == 200) {
            commit('GETUSERINFO', result.data)
            return '获取用户信息成功'
        } else {
            return Promise.reject(new Error('获取用户信息失败'))
        }
    },
    //用户退出清除登录信息
    async userLogout({ commit }) {
        let result = await reqUserLogout()
        if (result.code == 200) {
            commit('USERLOGOUT')
            return '用户退出登录成功'
        } else {
            return Promise.reject(new Error('用户退出登录失败'))
        }
    }
}
const mutations = {
    GETUSERSPASSPORT(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    USERLOGOUT(state) {
        //清除仓库中用户信息
        state.userInfo = {}
        state.token = ''
        //清除本地缓存用户身份token数据
        userLogout()
    }
}
const getters = {}

export default { state, actions, mutations, getters }