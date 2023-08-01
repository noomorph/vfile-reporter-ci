import assert from 'node:assert/strict'
import {test} from 'node:test'
import {mockGithubActions} from '../lib/utils/ci.js'
import {mockStdio} from '../lib/utils/node.js'
import {vfile1} from './fixtures.js'

test('noop', async function () {
  mockGithubActions(false)
  mockStdio({
    stdout: () => assert.fail('should not write to stdout'),
    stderr: () => assert.fail('should not write to stderr')
  })

  const {reporter} = await import('../index.js')
  reporter(vfile1())
  reporter([vfile1()])
})
