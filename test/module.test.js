import {test} from 'node:test'
import assert from 'node:assert/strict'

test('vfile-reporter-ci module', async function () {
  const mod = await import('../index.js')

  assert.deepEqual(
    Object.keys(mod).sort(),
    ['default', 'reporter'],
    'should expose the public api'
  )

  assert.equal(
    mod.reporter,
    mod.default,
    'should expose `reporter` as a named and a default export'
  )

  assert.throws(
    function () {
      // @ts-expect-error: Removed support for passing nullish, which used to be supported.
      mod.reporter()
    },
    /Unexpected value for `files`, expected one or more `VFile`s/,
    'should display a runtime error when an error is passed'
  )
})
