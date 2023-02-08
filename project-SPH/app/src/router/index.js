import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)

// 改良push方法
//location:要转到哪里；resolve：成功后回调函数；reject：失败后回调函数
let originPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        //原方法直接调用，this指向window,这里如果不改向this，这里的this会指向$router类实例对象
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}

//改良replace方法
let originReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        //原方法直接调用，this指向window,这里如果不改向this，这里的this会指向$router类实例对象
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

//暴露路由
let router = new VueRouter({
    routes,
    // es6写法，等价于routes:routes
    scrollBehavior(to, from, savedPosition) {
        return { y: 0 }
    }
})

//前置路由守卫
router.beforeEach(async (to, from, next) => {
    //to:获取到即将跳转的路由的信息
    //from:获取从哪个路由来的信息
    //next:可以指定next(path)放行到指定路由
    // next()//全部放行

    //如果用户已经登录了，就不要去登录界面了，
    //token存在说明用户登陆过
    let token = store.state.users.token
    let name = store.state.users.userInfo.name
    //这里不能用store.state.users.userInfo作为下面if的条件判定原因为：userinfo已经规定至少是一个空对象，空对象在if判断条件中会自动转化为true
    if (token) {
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            //如果已经登录，但是去的不是登录界面，就可以放行
            //但是存在一种特殊情况，用户已经登录，进入其他界面再次刷新的时候所有数据都消失了
            //进入vue界面发现用户身份令牌token还在，但是用户信息消失
            //用户身份信息消失的原因是之前派发获取用户信息在home的mounted选项中，且派发后获取到仓库的数据并没有永久性保存，所以刷新一下就会消失
            //所以即使登录了，在跳转路由前也要不断的获取用户信息
            // next()

            //已经登录，去的不是login
            //如果用户名已经有了
            if (name) {
                next()
            } else {
                //如果没有用户信息
                try {
                    //获取用户信息之后再跳转
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    //该情况为通过现有的token无法获取到用户信息（身份令牌过期了
                    //此时需要清空用户数据，重新登录，获取身份令牌及信息
                    await store.dispatch('userLogout')
                    next('/login')
                }
            }
        }
    } else {
        //如果未登录就放行可以去登录界面
        //未登录：不能去交易相关界面
        let toPath = to.path;
        if (toPath.indexOf('/trade') !== -1 || toPath.indexOf('/pay') !== -1 || toPath.indexOf('/center') !== -1) {
            next('/login?redirect=' + toPath)
        } else {
            next()
        }  
    }
})

export default router