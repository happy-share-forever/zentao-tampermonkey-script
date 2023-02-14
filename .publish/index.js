import simpleGit from 'simple-git'
import path from 'node:path'
import { execSync } from 'node:child_process'
import fse from 'fs-extra'
import config from './config.js'
import pkg from '../package.json' assert { type: 'json' }
//
const rootPath = path.resolve(path.join('.', '.publish'))
const workspace = path.join(rootPath, 'workspace')
const distFilePath = path.resolve(path.join('.', config.distPath, config.fileName))
const targetFilePath = path.join(workspace, ...config.publicPath.split('/'), config.fileName)
const branchName = `publish/${Date.now()}`

fse.ensureDirSync(workspace)
execSync(`rm -rf ${workspace}${path.sep}* \\
&& cd ${workspace} \\
&& git clone ${config.remote} \\
&& cd ${config.repositoryName} \\
&& git checkout -b ${branchName} \\
&& rm -rf ${targetFilePath}
`)

fse.copySync(distFilePath, targetFilePath, {})
const git = simpleGit(path.join(workspace, config.repositoryName))
git.add('.').commit(`release: ${config.fileName} release ${pkg.version} version.`).push('origin', branchName)
