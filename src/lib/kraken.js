'use strict'
import {default as $http} from 'axios'
const request = require('request-promise')
import crypto from 'crypto'
import qs from 'qs'
import buffer from 'react-zlib-js/buffer'
// Public/Private method names
const methods = {
	public  : [ 'Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC' ],
	private : [ 'Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder', 'CancelOrder', 'DepositMethods', 'DepositAddresses', 'DepositStatus', 'WithdrawInfo', 'Withdraw', 'WithdrawStatus', 'WithdrawCancel' ],
}

// Default options
const defaults = {
  url     : 'https://api.kraken.com',
  version : 0,
  timeout : 5000,
}

// Create a signature for a request
const getMessageSignature = (path, request, secret, nonce) => {
  const message       = qs.stringify(request)
  const secret_buffer = new buffer(secret, 'base64')
  const hash          = new crypto.createHash('sha256')
  const hmac          = new crypto.createHmac('sha512', secret_buffer)
  const hash_digest   = hash.update(nonce + message).digest('binary')
  const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64')

  return hmac_digest;
};

// Send an API request
const rawRequest = async (url, headers, data, clientLib) => {
	try {
		console.log('no sense 1', headers, 'sensedata', data)
	  // Set custom User-Agent string
	  headers['User-Agent'] = 'Kraken Javascript API Client'

	  var options = { headers }
		console.log('no sense 2', headers)
		let response;

		if (clientLib === 'axios'){
			Object.assign(options, {
				method : 'GET',
				body   : data//data//qs.stringify(data),
			})
  		response = await $http(url, options)
		} else {
			Object.assign(options, {
				uri: url,
				method : 'GET',
				qs   : data,//data//qs.stringify(data),
				resolveWithFullResponse: true,
				json: true
			})
			console.log('kraken api options', options)
			response = await request(options)
		}

		console.log('kraken api awaitresponse', typeof response.body, response.body)
//		console.log('kraken api response.data.result', response.data.result)

		const parsedResponse = response.body//JSON.parse(response.data.result)

		return parsedResponse
	} catch(error) {
		console.log('error catch mickey', error)
		console.log('error.request', error.request)
		console.log('error.response', error.response)
		if(error && error.length) {
			const e = error
				.filter((e) => e.startsWith('E'))
				.map((e) => e.substr(1))

			if(!error.length) {
				throw new Error("Kraken API returned an unknown error")
			}

			throw new Error("Kraken API returned a known error:)", error)
		}
	}
}

	/**
 * KrakenClient connects to the Kraken.com API
 * @param {String}        key               API Key
 * @param {String}        secret            API Secret
 * @param {String|Object} [options={}]      Additional options. If a string is passed, will default to just setting `options.otp`.
 * @param {String}        [options.otp]     Two-factor password (optional) (also, doesn't work)
 * @param {Number}        [options.timeout] Maximum timeout (in milliseconds) for all API-calls (passed to `request`)
 */
class KrakenClient {
	constructor(key, secret, options) {
		// Allow passing the OTP as the third argument for backwards compatibility
		if(typeof options === 'string') {
			options = { otp : options }
		}

		this.config = Object.assign({ key, secret }, defaults, options)
	}

	/**
	 * This method makes a public or private API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback function to be executed when the request is complete
	 * @return {Object}            The request object
	 */
   api(method, params, clientLib, callback) {
    // Default params to empty object
    if(typeof clientLib === 'function') {
      callback = clientLib
      params   = {}
    }

    if(methods.public.includes(method)) {
      return this.publicMethod(method, params, clientLib, callback)
    }
    else if(methods.private.includes(method)) {
      return this.privateMethod(method, params, callback)
    }
    else {
      throw new Error(method + ' is not a valid API method.')
    }
  }

	/**
		* This method makes a public API request.
		* @param  {String}   method   The API method (public or private)
		* @param  {Object}   params   Arguments to pass to the api call
		* @param  {Function} callback A callback function to be executed when the request is complete
		* @return {Object}            The request object
	*/
   publicMethod(method, params, clientLib, callback) {
    params = params || {}

    // Default params to empty object
    if(typeof params === 'function') {
      callback = params;
      params   = {}
    }

    const path     = '/' + this.config.version + '/public/' + method
    const url      = this.config.url + path
    let response = rawRequest(url, {}, params, clientLib)

    if(typeof callback === 'function') {
      response
        .then((result) => callback(null, result))
        .catch((error) => callback(error, null))
    }

		return response
	}

	/**
	 * This method makes a private API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback function to be executed when the request is complete
	 * @return {Object}            The request object
	 */
	privateMethod(method, params, callback) {
		params = params || {}

		// Default params to empty object
		if(typeof params === 'function') {
			callback = params
			params   = {}
		}

		const path = '/' + this.config.version + '/private/' + method
		const url  = this.config.url + path

		if(!params.nonce) {
			params.nonce = new Date() * 1000 // spoof microsecond
		}

		if(this.config.otp !== undefined) {
			params.otp = this.config.otp
		}

		const signature = getMessageSignature(
			path,
			params,
			this.config.secret,
			params.nonce
    )

    const headers = {
      'API-Key'  : this.config.key,
      'API-Sign' : signature,
    }
    var response = rawRequest(url, headers, params, this.config.timeout)

    if(typeof callback === 'function') {
      response
        .then((result) => callback(null, result))
        .catch((error) => callback(error, null))
    }

    return response
  }
}

export { KrakenClient }
