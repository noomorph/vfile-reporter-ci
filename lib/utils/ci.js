/* eslint-disable import/no-mutable-exports */
import ci from 'ci-info'

export let isGithubActions = () => ci.GITHUB_ACTIONS

/** @param {boolean} value */
export function mockGithubActions(value) {
  isGithubActions = () => value
}
