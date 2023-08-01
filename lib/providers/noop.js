/**
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 * @typedef {import('vfile-statistics').Statistics} Statistics
 * @typedef {import('../reporter.js').State} State
 */

/**
 * @param {State} _state
 * @param {VFileMessage} _message
 * @returns {void}
 */
export function emitMessage(_state, _message) {}

/**
 * @param {State} _state
 * @param {Statistics} _stats
 * @returns {void}
 */
export function emitStatistics(_state, _stats) {}
