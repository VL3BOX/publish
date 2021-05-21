import { $helper } from '@jx3box/jx3box-common/js/https'
import qs from 'qs'

/**
 * 保存joke
 * @param {string} params.content 骚话内容
 * @returns 
 */
const saveJoke = (params) => {

  const data = { content: params.content }

  return $helper()({
    method: 'POST',
    url: '',
    data: qs.stringify(data)
  })
}
/**
 * 获取joke列表
 * @param {*} params 
 * @returns 
 */
const getJokes = (params) => {

  return $helper()({
    method: 'GET',
    url: 'http://localhost:3000/mock/38/jokes',
    params
  })
}

export {
  saveJoke,
  getJokes
}
