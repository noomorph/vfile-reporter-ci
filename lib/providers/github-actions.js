/**
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 * @typedef {import('vfile-statistics').Statistics} Statistics
 * @typedef {import('../reporter.js').State} State
 */

import {appendFileSync, env, stdoutWrite} from '../utils/node.js'

/**
 * @param {State} state
 * @param {VFileMessage} message
 * @returns {void}
 */
export function emitMessage(state, message) {
  const level = message.fatal ? 'error' : 'warning'
  const file = message.file || state.defaultName
  const line = message.line ?? 1
  const col = message.column ?? 1

  if (file)
    stdoutWrite(
      `::${level} file=${file},line=${line},col=${col}::${message.message}\n`
    )
}

/**
 * @param {State} state
 * @param {Statistics} stats
 * @returns {void}
 */
export function emitStatistics(state, stats) {
  const fileName = env.GITHUB_STEP_SUMMARY

  if (fileName)
    appendFileSync(
      fileName,
      `\
* **Fatal:** ${stats.fatal}
* **Warn:** ${stats.warn}
* **Info:** ${stats.info}
* **Nonfatal:** ${stats.nonfatal}
* **Total:** ${stats.total}
`
    )
}
