import Mock from 'mockjs'
//webpack默认对外暴露：图片，json，所以json不用再暴露了直接引入就可以
import banner from './banner.json'
import floor from './floor.json'

//调用mock方法
//第一个参数：请求数据的地址  第二个参数：请求的数据
Mock.mock('/mock/banner', { code: 200, data: banner })
Mock.mock("/mock/floor", { code: 200, data: floor })  