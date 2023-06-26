import * as core from '@actions/core'
import * as process from 'process'
import {execSync} from 'child_process'

try {
  const output = execSync('haxelib list').toString()

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
          console.log(`lib:\x1b[36m${lib}\x1b[0m\nversion:${version}\n`)
        } else {
          const path = execSync(`haxelib libpath ${lib}`).toString().trim()
          process.chdir(path)
          execSync(`git fetch --tags --quiet --force`)
          const branch = execSync(`git rev-parse --abbrev-ref HEAD`)
            .toString()
            .trim()

          const latestTag = execSync(`git describe --tags`).toString().trim()
          const commitSha = execSync(`git rev-parse HEAD`).toString().trim()
          const commitDate = execSync(`git show -s --format=%ci ${commitSha}`)
            .toString()
            .trim()

          console.log(
            `lib: ${lib}\nversion:git/dev\nbranch: ${branch}\nlatest tag: ${latestTag}\ncommit sha: ${commitSha}\ncommit date: ${commitDate}\n`
          )
          process.chdir(baseDir)
        }
      }
    }
  }
} catch (error) {
  core.warning('Printing haxelib dependencies failed')
  console.log(error)
}
