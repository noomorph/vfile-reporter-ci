/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 * @typedef {import('vfile-statistics').Statistics} Statistics
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [stats=true]
 *   Whether to show statistics. Default: `true`.
 * @property {string | null | undefined} [defaultName='<stdin>']
 *   Label to use for files without file path (default: `'<stdin>'`); if one
 *   file and no `defaultName` is given, no name will show up in the report.
 * @property {boolean | null | undefined} [silent=false]
 *   Show errors only (default: `false`); this hides info and warning messages
 */

/**
 * @typedef State
 *   Info passed around.
 * @property {string | undefined} defaultName
 *   Default name to use.
 * @property {boolean} stats
 *   Whether to show statistics. Default: `true`.
 * @property {boolean} silent
 *   Whether to hide warnings and info messages.
 *
 * @typedef CodeSplit
 * @property {number} index
 * @property {number} size
 *
 * @typedef CIProvider
 * @property {(state: State, message: VFileMessage) => void} emitMessage
 * @property {(state: State, stats: Statistics) => void} emitStatistics
 */

import {compareFile, compareMessage} from 'vfile-sort'
import {statistics} from 'vfile-statistics'
import * as ci from './providers/auto.js'

/**
 * Create a report from one or more files.
 *
 * @param {Array<VFile> | VFile} files
 *   Files or error to report.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {void}
 */
export function reporter(files, options) {
  if (!files) {
    throw new TypeError(
      'Unexpected value for `files`, expected one or more `VFile`s'
    )
  }

  /** @type {Partial<Options>} */
  const settings = options || {}

  if (!Array.isArray(files)) {
    files = [files]
  }

  /** @type {State} */
  const state = {
    stats: settings.stats !== false,
    defaultName: settings.defaultName || undefined,
    silent: settings.silent || false
  }

  report(state, files)
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Readonly<Array<VFile>>} files
 *   Files.
 * @returns {void}
 */
function report(state, files) {
  // To do: when Node 18 is EOL, use `toSorted`.
  const sortedFiles = [...files].sort(compareFile)
  /** @type {Array<VFileMessage>} */
  const all = []
  let index = -1

  while (++index < sortedFiles.length) {
    const file = sortedFiles[index]
    // To do: when Node 18 is EOL, use `toSorted`.
    const messages = [...file.messages].sort(compareMessage)
    let offset = -1

    while (++offset < messages.length) {
      const message = messages[offset]

      if (!state.silent || message.fatal) {
        ci.emitMessage(state, message)
        all.push(message)
      }
    }
  }

  if (state.stats !== false) {
    ci.emitStatistics(state, statistics(all))
  }
}
