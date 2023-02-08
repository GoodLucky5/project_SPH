import {v4 as uuidv4} from 'uuid'
export const getUUID = () => {
    //获取本地存储的UUID
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    //如果本地没有
    if (!uuid_token) {
        uuid_token = uuidv4()
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    return uuid_token
}