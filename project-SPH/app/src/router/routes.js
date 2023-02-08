// 路由配置信息
//引入路由组件

import Home from '@/pages/Home'
//使用懒加载：
// const foo = () => {
//     return import('@/pages/Home')
// }
//简化写法
// const foo = ()=> import('@/pages/Home')
//直接把这个放到路由中就完成了只有某路由被访问，才加载对应组件，项目更高效了
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/components/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import paySuccess from '@/pages/paySuccess'
import Center from '@/pages/Center'
//引入二级路由
import myOrder from '@/pages/Center/myOrder'
import groupOrder from '@/pages/Center/groupOrder'

export default
    [{
        path: "/center",
        component: Center,
        meta: { isShow: true },
        redirect:'/center/myorder',
        children: [
            {
                path: 'myorder',
                component:myOrder
            },
            {
                path: 'grouporder',
                component:groupOrder
            }
        ]
    },{
        path: "/paysuccess",
        component: paySuccess,
        meta: { isShow: true }
    },
        {
        path: "/pay",
        component: Pay,
            meta: { isShow: true },
            beforeEnter: (to, from, next)=>{
                if (from.path == '/trade') {
                    next()
                } else {
                    next(false)
                }
            }
    },
        {
        path: "/trade",
        component: Trade,
            meta: { isShow: true },
        beforeEnter: (to, from, next) => {
            // ...路由独享守卫,去交易界面必须从购物车来，其他的不行
            if (from.path == '/shopcart') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: "/shopcart",
        component: ShopCart,
        meta: { isShow: true }
    },
    {
        name: 'addcartsuccess',
        path: "/addcartsuccess",
        component: AddCartSuccess,
        meta: { isShow: true }
    },
    {
        //这里是用的router-link跳转的，所以不需要加name
        path: "/detail/:skuid",
        component: Detail,
        meta: { isShow: true }
    },

    {
        path: "/home",
        component: ()=> import('@/pages/Home'),
        meta: { isShow: true }
    },
    {
        name: 'search',
        path: "/search/:keywords?",
        component: Search,
        meta: { isShow: true }
    },
    {
        path: "/login",
        component: Login,
        meta: { isShow: false }
    },
    {
        path: "/register",
        component: Register,
        meta: { isShow: false }
    }
    ]