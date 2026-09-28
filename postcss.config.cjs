module.exports = {
    plugins: {
        // Convert CSS px from the 750px mobile design draft into vw units.
        // 将 750 移动端设计稿中的 CSS px 转换为 vw 单位。
        'postcss-px-to-viewport-8-plugin': {
            unitToConvert: 'px',
            viewportWidth: 750,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            // Keep 1px borders and tiny values as real pixels.
            // 让 1px 边框和极小数值继续保留为真实 px。
            minPixelValue: 2,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/],
            landscape: false,
        },
    },
}
