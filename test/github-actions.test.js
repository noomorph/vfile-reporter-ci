import {test} from 'node:test'
import assert from 'node:assert/strict'
import {mockGithubActions} from '../lib/utils/ci.js'
import {mockEnv, mockFileIO, mockStdio} from '../lib/utils/node.js'
import {vfile1, vfileUnknown} from './fixtures.js'

test('github actions: stdout', async function () {
  /** @type {string[]} */
  const stdout = []

  mockGithubActions(true)
  mockEnv({})
  mockStdio({stdout, stderr: () => assert.fail('should not write to stderr')})
  mockFileIO({files: {}})

  const {reporter} = await import('../index.js')
  reporter(vfile1())

  assert.deepEqual({}, {})
  assert.deepEqual(stdout, [
    '::warning file=lib/reporter.js,line=1,col=1::Too much JSDoc\n',
    '::error file=lib/reporter.js,line=44,col=1::Do not use exports... hey, just kidding!\n'
  ])
})

test('github actions: summary (default)', async function () {
  /** @type {Record<string, string>} */
  const files = {}
  mockGithubActions(true)
  mockEnv({GITHUB_STEP_SUMMARY: 'test.txt'})
  mockStdio({
    stdout: [],
    stderr: () => assert.fail('should not write to stderr')
  })
  mockFileIO({files})

  const {reporter} = await import('../index.js')
  reporter(vfile1())

  assert.equal(Object.keys(files).length, 1)
  const contents = files['test.txt'].split('\n')
  assert.deepEqual(contents, [
    '* **Fatal:** 1',
    '* **Warn:** 1',
    '* **Info:** 0',
    '* **Nonfatal:** 1',
    '* **Total:** 2',
    ''
  ])
})

test('github actions: summary (disabled)', async function () {
  /** @type {Record<string, string>} */
  const files = {}
  mockGithubActions(true)
  mockEnv({GITHUB_STEP_SUMMARY: 'test.txt'})
  mockStdio({
    stdout: [],
    stderr: () => assert.fail('should not write to stderr')
  })
  mockFileIO({files})

  const {reporter} = await import('../index.js')
  reporter([vfile1()], {
    stats: false
  })

  assert.equal(Object.keys(files).length, 0)
})

test('github actions: only errors', async function () {
  /** @type {string[]} */
  const stdout = []
  mockGithubActions(true)
  mockEnv({})
  mockStdio({stdout, stderr: () => assert.fail('should not write to stderr')})

  const {reporter} = await import('../index.js')
  reporter([vfile1()], {
    silent: true
  })

  assert.deepEqual(stdout, [
    '::error file=lib/reporter.js,line=44,col=1::Do not use exports... hey, just kidding!\n'
  ])
})

test('github actions: empty error', async function () {
  /** @type {string[]} */
  const stdout = []
  mockGithubActions(true)
  mockEnv({})
  mockStdio({stdout, stderr: () => assert.fail('should not write to stderr')})

  const {reporter} = await import('../index.js')
  reporter([vfileUnknown()], {
    defaultName: 'index.js'
  })

  assert.deepEqual(stdout, [
    '::error file=index.js,line=1,col=1::Something went wrong\n'
  ])
})
