//vue的插件一定是暴露一个对象，并且这个对象必须有一个install方法

let myPlugins = {}


myPlugins.install = function(Vue, options){
    //注册/获取全局指令
    Vue.directive(options.name, (element,params) => {
        element.innerHTML = params.value.toUpperCase()
    })}
    


export default myPlugins;