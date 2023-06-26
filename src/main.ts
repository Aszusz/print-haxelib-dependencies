import * as core from '@actions/core'
import * as process from 'process'
import {execSync} from 'child_process'

try {
  const output = execSync('haxelib list').toString()

  console.log(`haxelib list output:\n${output}`)

  const lines = output.split('\n')
  const baseDir = execSync('pwd').toString().trim()

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
          const path = execSync(`haxelib libpath ${lib}`).toString().trim()
          process.chdir(path)
          execSync(`git fetch --tags --quiet --force`)
          const ref = execSync(`git rev-parse --abbrev-ref HEAD`).toString()
          const tag = execSync(`git describe --tags --always`).toString()
          console.log(`lib:${lib}, ref:${ref}, tag:${tag}`)
          process.chdir(baseDir)
        }
      }
    }
  }
} catch (error) {
  core.warning('Printing haxelib dependencies failed')
  console.log(error)
}
