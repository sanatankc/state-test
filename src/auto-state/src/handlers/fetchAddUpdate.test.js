import { expect } from 'chai'
import { fromJS } from 'immutable'
import { mergeAndRemoveListOfMaps } from './fetchAddUpdate'

describe('mergeAndRemoveListOfMaps', () => {
  it('merges two immutable list of maps with different keys', () => {
    const state = [{ id: 0, a: 'b', c: 'ds', e: 'dsd', __keys: ['b'] }]
    const stateToBeMerged = [{ id: 1, b: 'ds', d: 'dsd' }]
    expect(mergeAndRemoveListOfMaps(fromJS(state), fromJS(stateToBeMerged), 'ab').equals(fromJS([
      { id: 1, b: 'ds', d: 'dsd', __keys: ['ab'] },
      { id: 0, a: 'b', c: 'ds', e: 'dsd', __keys: ['b'] }
    ]))).to.eql(true)
  })

  it('merge items if id of both items are same', () => {
    const state = [{ id: 0, a: 'b', c: 'ds', e: 'dsd', __keys: ['b'] }]
    const stateToBeMerged = [{ id: 0, b: 'ds', d: 'dsd' }]
    expect(mergeAndRemoveListOfMaps(fromJS(state), fromJS(stateToBeMerged), 'b').equals(fromJS([
      { id: 0, a: 'b', c: 'ds', b :'ds', d: 'dsd', e: 'dsd', __keys: ['b'] }
    ]))).to.eql(true)
  })

  it('append key in __keys if stateToBeMerged has different id', () => {
    const state = [{ id: 0, a: 'b', c: 'ds', e: 'dsd', __keys: ['b'] }]
    const stateToBeMerged = [{ id: 0, b: 'ds', d: 'dsd' }]
    expect(mergeAndRemoveListOfMaps(fromJS(state), fromJS(stateToBeMerged), 'ba').equals(fromJS([
      { id: 0, a: 'b', c: 'ds', b :'ds', d: 'dsd', e: 'dsd', __keys: ['b', 'ba'] }
    ]))).to.eql(true)
  })
})