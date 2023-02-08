//长久存储用户信息
export const setToken = (token) => {
    localStorage.setItem('TOKEN',token)
}

//用户退出登录删除用户信息
export const userLogout = () => {
    localStorage.clear('TOKEN')
}