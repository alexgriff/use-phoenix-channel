# use-phoenix-channel
A React hook that allows for responding to and broadcasting messages over [Phoenix](https://github.com/phoenixframework/phoenix#readme) channels.

```
yarn add use-phoenix-channel
```

There are two main pieces to the libray, the `SocketProvider` Component and the `useChannel` hook.

## `SocketProvider` Component

 To be used once at a high level in the component tree similar to Redux Provider:
```js
import React from 'react'
import { SocketProvider } from 'use-phoenix-channel'

const Root = (props) => {
 return (
   <SocketProvider wsUrl='localhost:4000/socket', options={{ token }}>
     <App />
   </SocketProvider>
  )
}

export default Root
```

## `useChannel` Hook

```js
import React from 'react'
import { useChannel } from 'use-phoenix-channel'

const MyComponent = () => {
  const [state, broadcast] = useChannel(channelName, reducer, initialState)
  // ...
}
```

The useChannel hook gives a component access to state that will update in real time in response to messages broadcast over a channel. It also gives a component access to a function to broadcast messages over the specified channel.

It should be passed the name of the channel, a reducer function defining the messages to respond to and any initial state.

#### Responding to Messages

```js
import React from 'react'
import { useChannel } from 'use-phoenix-channel'

const channelName = 'counter:example'
const countReducer = (state, {event, payload}) => {
  // the second argument is the message sent over the channel
  // it will contain an event key and a payload key
  switch(event) {
    case 'increment':
      return state + payload.amount
    case 'decrement':
      return state - payload.amount
  }
}
const initialState = 0

const MyComponent = (props) => {
  const [{ count }, broadcast] = useChannel(channelName, reducer, initialState)

  return (
    <div>
      <h1>{`The value below will update in realtime as the count is changed by other subscribers to the {channelName} channel`}</h1>
      { count }
    </div>
  )
}
```

### Broadcasting Messages

The broadcast function returned by the hook can be invoked to push messages onto the channel.
It should be passed the event name and a payload.

```js
import React from 'react'
import { useChannel } from 'use-phoenix-channel'

const MyComponent = (props) => {
  const [state, broadcast] = useChannel(channelName, reducer, initialState)

  return (
    <div>
      <button onClick={() => broadcast("increment", {amount: props.amount}) }>
        {`Increment by ${props.amount}`}
      <button />
      <button onClick={() => broadcast("decrement", {amount: props.amount}) }>
        {`Decrement by ${props.amount}`}
      <button />
    </div>
  )
}

```
