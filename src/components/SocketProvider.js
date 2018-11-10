import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Socket } from 'phoenix'

import SocketContext from '../contexts/SocketContext'

const SocketProvider = ({wsUrl, options, children}) => {
  const socket = new Socket(wsUrl, { params: options })

  useEffect(() => { socket.connect() }, [options, wsUrl])

  return (
    <SocketContext.Provider value={socket}>
      { children }
    </SocketContext.Provider>
   )
 }

SocketProvider.defaultProps = {
 options: {}
}

SocketProvider.propTypes = {
  wsUrl: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
}

export default SocketProvider
