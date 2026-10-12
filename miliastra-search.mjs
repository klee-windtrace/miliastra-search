#!/usr/bin/env node
// Node entry point: install the real-file-system host, then run the engine.
import './src/host-node.mjs';
import { safeMain } from './src/cli.mjs';

const io = { out: (t) => process.stdout.write(t), err: (t) => process.stderr.write(t), isTTY: process.stdout.isTTY === true, env: process.env };
process.exitCode = safeMain(process.argv.slice(2), io);
