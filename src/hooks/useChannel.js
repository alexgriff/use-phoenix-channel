import { useContext, useEffect, useReducer, useState } from 'react'
import SocketContext from '../contexts/SocketContext'

const useChannel = (channelTopic, reducer, initialState) => {
  const socket = useContext(SocketContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [broadcast, setBroadcast] = useState()

  useEffect(() => {
    joinChannel(socket, channelTopic, dispatch, setBroadcast)
  }, [channelTopic])

  return [state, broadcast]
}

const joinChannel = (socket, channelTopic, dispatch, setBroadcast) => {
  const channel = socket.channel(channelTopic, {client: 'browser'})

  socket.onMessage(({ event, topic, payload }) => {
    if (topic === channelTopic) {
      dispatch({ event, payload })
    }
  })

  channel.join()
    .receive("ok", ({messages}) =>  console.log('successfully joined channel', messages || ''))
    .receive("error", ({reason}) => console.error('failed to join channel', reason))

  setBroadcast(() => channel.push.bind(channel))
}

export default useChannel
