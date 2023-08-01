import {VFile} from 'vfile'

export function vfile1() {
  const file1 = new VFile({path: 'lib/reporter.js'})

  file1.message('Too much JSDoc', {
    ruleId: 'jsdoc',
    place: {
      start: {line: 1, column: 1},
      end: {line: 5, column: 3}
    }
  })

  try {
    file1.fail('Do not use exports... hey, just kidding!', {
      place: {
        line: 44,
        column: 1
      }
    })
  } catch {}

  return file1
}

export function vfileUnknown() {
  const fileU = new VFile()

  try {
    fileU.fail(new Error('Something went wrong'))
  } catch {}

  return fileU
}
