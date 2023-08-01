/* eslint-disable import/no-mutable-exports */
/* c8 ignore start */

import fs from 'node:fs'
import process from 'node:process'

/** @type {(message: string) => void} */
export let stdoutWrite = (message) => {
  process.stdout.write(message)
}

/** @type {(message: string) => void} */
export let stderrWrite = (message) => {
  process.stderr.write(message)
}

export let env = process.env
export let appendFileSync = fs.appendFileSync

/**
 * @param {object} options
 * @param {string[] | ((message: string) => void)} options.stdout
 * @param {string[] | ((message: string) => void)} options.stderr
 */
export function mockStdio(options) {
  stdoutWrite =
    typeof options.stdout === 'function'
      ? options.stdout
      : options.stdout.push.bind(options.stdout)

  stderrWrite =
    typeof options.stderr === 'function'
      ? options.stderr
      : options.stderr.push.bind(options.stderr)
}

/** @param {*} value */
export function mockEnv(value) {
  env = value
}

/**
 * @param {object} options
 * @param {Record<string, string>} options.files
 */
export function mockFileIO(options) {
  appendFileSync = (path, data) => {
    const key = String(path)
    options.files[key] ??= ''
    options.files[key] += String(data)
  }
}

/* c8 ignore end */
