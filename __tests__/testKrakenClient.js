import React from 'react'
import {kraken} '../constants'

// These serve as integration tests for the jest-react-native preset.
it('should return single selected asset pair with request', () => {
//  const ActivityIndicator = require('ActivityIndicator')
  return kraken.api('Ticker', { pair : 'XBTEUR' }, 'request').then((response) => {
    expect(response).toEqual(expect.objectContaining({
      error: expect.arrayContaining([]),
      result: expect.any(Object)
    }))
  })
})
it('should return single selected asset pair with axios', () => {
//  const ActivityIndicator = require('ActivityIndicator')
  return kraken.api('Ticker', { pair : 'XBTEUR' }, 'axios').then((response) => {
    expect(response).toEqual(expect.objectContaining({
      error: expect.arrayContaining([]),
      result: expect.any(Object)
    }))
  })
})

/*
it(':ios: shows external component in stack in modal', async () => {
//  await elementById(testIDs.COMPLEX_LAYOUT_BUTTON).tap()
//  await elementById(testIDs.EXTERNAL_COMPONENT_IN_STACK).tap()
  await expect(elementByLabel('animateHomeLabel')).toBeVisible()
})
*/
