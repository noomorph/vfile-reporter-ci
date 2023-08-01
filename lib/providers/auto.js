import * as ci from '../utils/ci.js'
import * as noop from './noop.js'
import * as githubActions from './github-actions.js'

export const {emitMessage, emitStatistics} = (function () {
  if (ci.isGithubActions()) return githubActions
  return noop
})()
