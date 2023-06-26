import * as core from '@actions/core'
import * as process from 'process'
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
          console.log('start')
          const path = execSync(`haxelib libpath ${lib}`).toString().trim()
          console.log(`path:${path}`)
          console.log(`last char:${path.slice(-1)}`)
          execSync(`cd ${path}`)
          const ref = execSync(`git rev-parse --abbrev-ref HEAD`).toString()
          console.log(`lib:${lib}, version:${ref}`)
          process.chdir(baseDir)
        }
      }
    }
  }
} catch (error) {
  core.warning('Printing haxelib dependencies failed')
  console.log(error)
}
