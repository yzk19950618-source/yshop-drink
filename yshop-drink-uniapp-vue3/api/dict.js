import api from './api'

/**
 * 按字典类型拉取启用中的字典项（与后台「字典管理」一致）
 * @param {string} type 如 mall_drink_extra_group
 */
export function getDictDataByType(type) {
  return api.get('/system/dict-data/type', { type }, { login: false })
}
