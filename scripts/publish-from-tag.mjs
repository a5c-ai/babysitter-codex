#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const ref = process.env.GITHUB_REF_NAME || '';
const branch = ref.split('/')[1] || 'develop';
const tag = branch === 'main' ? 'latest' : branch;
const result = spawnSync('npm', ['publish', '--access', 'public', '--tag', tag], { stdio: 'inherit' });
process.exit(result.status || 0);
