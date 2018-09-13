import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
//import './index.css'
//import { kraken } from '../../constants'

class Layout extends React.Component {
//  async componentDidMount() {
//    const krakPromise = new Promise((resolve, reject) => {
//      return kraken.api('Ticker', { pair : 'XXBTZUSD' })
//    })
//    console.log('kraken api await', krakPromise)
//  }
  render() {
    return (
      <div>
        <div
          style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
          }}
        >
        this is the tesxt welcome react
        </div>
      </div>
    )
  }
}
//export default Layout
/*
Layout.propTypes = {
  children: PropTypes.func,
}
*/

if(typeof window !== 'undefined') {
  ReactDOM.render(
    <Layout />,
    document.getElementById('app-root')
  )
}
