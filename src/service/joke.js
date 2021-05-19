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

export {
  saveJoke
}
