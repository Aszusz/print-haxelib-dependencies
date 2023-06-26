import * as core from '@actions/core'
import {execSync} from 'child_process'

try {
  const output = execSync('haxelib list').toString()

  console.log(`haxelib list output:\n${output}`)

  const lines = output.split('\n')
  const baseDir = execSync('pwd').toString()

  for (const line of lines) {
    if (line) {
      const groups = /^(?<lib>[\w-]+):[^[]+\[(?<version>[^\]]+)\]$/gm.exec(
        line
      )?.groups

      if (groups) {
        const {lib, version} = groups
        const isNumber = /\d+\.\d+\.\d+/.test(version)
        if (isNumber) {
          console.log(`lib:${lib}, version:${version}`)
        } else {
          const path = execSync(`haxelib path ${lib}`).toString()
          execSync(`cd ${path}`)
          const ref = execSync(`git rev-parse --abbrev-ref HEAD`).toString()
          console.log(`lib:${lib}, version:${ref}`)
          execSync(`cd ${baseDir}`)
        }
      }
    }
  }
} catch (error) {
  core.warning('Printing haxelib dependencies failed')
}
