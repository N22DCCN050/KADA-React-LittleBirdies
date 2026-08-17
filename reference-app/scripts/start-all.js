const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting LittleBirdies Mock Backend & Expo Metro Bundler in parallel...\n');

const backendCwd = path.join(__dirname, '../mock-backend');
const appCwd = path.join(__dirname, '..');

// 1. Launch Node.js Express Backend on Port 5000
const backendProcess = spawn('node', ['server.js'], {
  cwd: backendCwd,
  stdio: 'inherit',
  shell: true,
});

// 2. Launch Expo Metro Bundler
const expoProcess = spawn('npx', ['expo', 'start', ...process.argv.slice(2)], {
  cwd: appCwd,
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Stopping servers...');
  try { backendProcess.kill(); } catch (e) {}
  try { expoProcess.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
