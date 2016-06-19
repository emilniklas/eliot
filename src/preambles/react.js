import React from 'react'

if (process.env.ELIOT_TARGET === 'browser') {
  window.__react = React.createElement
} else {
  global.__react = React.createElement
}
