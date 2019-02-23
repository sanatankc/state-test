import { get } from 'lodash'

export const getItemByProp = (data, prop, value) => {
  const foundData = data.find(item =>
    get(item, prop) === value
  ) || {}
  return foundData
}

export const getDataByProp = (data, prop, value) => {
  if (!data) return []
  const foundData = data.filter(item =>
    get(item, prop) === value
  ) || []
  return foundData
}

export const getDataById = (data, id) => getItemByProp(data, 'id', id)
