const { build } = require('esbuild')
const { join } = require('path')

async function buildElectron() {
  try {
    await build({
      entryPoints: [join(__dirname, '../electron/main.ts')],
      bundle: true,
      outfile: join(__dirname, '../dist-electron/main.js'),
      platform: 'node',
      target: 'node16',
      external: ['electron'],
      format: 'cjs',
      sourcemap: false,
      minify: false,
    })
    console.log('Electron main process built successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildElectron()