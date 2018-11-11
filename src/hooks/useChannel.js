import { useContext, useEffect, useReducer, useState } from 'react'
import SocketContext from '../contexts/SocketContext'

const useChannel = (channelTopic, reducer, initialState) => {
  const socket = useContext(SocketContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning)

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

const mustJoinChannelWarning = () => (
  () => console.error(`useChannel broadcast function cannot be invoked before the channel has been joined`)
)
export default useChannel
