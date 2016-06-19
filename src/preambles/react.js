import React from 'react'
import { env } from '../index'

if (env.ELIOT_TARGET === 'browser') {
  window.__react = React.createElement
} else {
  global.__react = React.createElement
}
