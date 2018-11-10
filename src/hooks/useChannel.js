import { useContext, useReducer, useEffect } from 'react'
import SocketContext from '../contexts/SocketContext'


const useChannel = (channelTopic, reducer, initialState) => {
  const socket = useContext(SocketContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  if (!hasJoinedChannel(socket, channelTopic)) {

    const channel = socket.channel(channelTopic, {client: 'browser'})

    socket.onMessage(({ event, topic, payload }) => {
      if (topic === channelTopic) {
        dispatch({ event, payload })
      }
    })

    channel.join()
      .receive("ok", ({messages}) =>  console.log('successfully joined channel', messages || '') )
      .receive("error", ({reason}) => console.error('failed to join channel', reason) )
  }

  return state
}

const hasJoinedChannel = (socket, topic) => {
  return !!socket.channels.find(channel => channel.topic === topic)
}

export default useChannel
