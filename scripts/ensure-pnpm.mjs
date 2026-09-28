const userAgent = process.env.npm_config_user_agent || ''
const isPnpm = userAgent.startsWith('pnpm/')

if (!isPnpm) {
    console.error('')
    console.error('This project uses pnpm only.')
    console.error('Please run commands with pnpm, for example:')
    console.error('')
    console.error('    pnpm install')
    console.error('    pnpm dev')
    console.error('')
    console.error('本项目只允许使用 pnpm。')
    console.error('请使用 pnpm 执行命令，例如：')
    console.error('')
    console.error('    pnpm install')
    console.error('    pnpm dev')
    console.error('')
    process.exit(1)
}
