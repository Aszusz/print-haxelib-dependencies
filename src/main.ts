import * as core from '@actions/core'
import {execSync} from 'child_process'

try {
  const output = execSync('haxelib list').toString()

  const lines = output.split('\n')
  for (const line of lines) {
    if (line) {
      const groups = /^(?<lib>[\w-]+):[^[]+\[(?<version>[^\]]+)\]$/gm.exec(
        line
      )?.groups

      if (groups) {
        const {lib, version} = groups
        core.debug(`lib:${lib}, version:${version}`)
      }
    }
  }
} catch (error) {
  core.warning('Printing haxelib dependencies failed')
}
