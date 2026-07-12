#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  LEGACY_HOOK_EVENT_NAMES,
  MANAGED_HOOK_SCRIPT_NAMES,
} = require('../bin/install-shared');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'hooks.json'), 'utf8'));
const hooks = config.hooks;

assert.deepEqual(
  Object.keys(hooks).sort(),
  ['PreToolUse', 'SessionStart', 'Stop'],
  'only supported, implemented Codex hooks should be registered',
);

function commandFor(eventName) {
  const matchers = hooks[eventName];
  assert.equal(matchers.length, 1, `${eventName} should have one matcher`);
  assert.equal(matchers[0].hooks.length, 1, `${eventName} should have one command`);
  return matchers[0].hooks[0].command;
}

const sessionStart = commandFor('SessionStart');
assert.match(sessionStart, /\$\{PLUGIN_ROOT:-\$HOME\/\.codex\}\/hooks\/babysitter-proxied-session-start\.sh/);

for (const [eventName, scriptName] of [
  ['SessionStart', 'babysitter-proxied-session-start.sh'],
  ['PreToolUse', 'babysitter-proxied-pre-tool-use.sh'],
  ['Stop', 'babysitter-proxied-stop.sh'],
]) {
  const command = commandFor(eventName);
  assert.equal(command, `bash "${'${PLUGIN_ROOT:-$HOME/.codex}'}/hooks/${scriptName}"`);
  assert.doesNotMatch(command, /adapters-hooks/);
}

assert.deepEqual(MANAGED_HOOK_SCRIPT_NAMES.sort(), [
  'babysitter-proxied-pre-tool-use.sh',
  'babysitter-proxied-session-start.sh',
  'babysitter-proxied-stop.sh',
]);
assert.deepEqual(LEGACY_HOOK_EVENT_NAMES.sort(), [
  'PostToolUse',
  'PreToolUse',
  'SessionEnd',
  'SessionStart',
  'Stop',
  'UserPromptSubmit',
]);

console.log('Codex hook contract validation passed');
