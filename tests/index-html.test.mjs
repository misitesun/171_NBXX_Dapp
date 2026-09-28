import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const indexHtml = readFileSync('index.html', 'utf8')
const viteConfig = readFileSync('vite.config.ts', 'utf8')

test('index html keeps the mobile H5 meta baseline', () => {
    const viewportMatches = indexHtml.match(/<meta\s+name="viewport"/g) ?? []

    assert.equal(viewportMatches.length, 1)
    assert.match(indexHtml, /<html lang="zh-Hans" prefix="og: https:\/\/ogp\.me\/ns#">/)
    assert.match(indexHtml, /<meta charset="utf-8" \/>/)
    assert.match(indexHtml, /width=device-width/)
    assert.match(indexHtml, /initial-scale=1/)
    assert.match(indexHtml, /viewport-fit=cover/)
    assert.match(indexHtml, /minimum-scale=1/)
    assert.match(indexHtml, /maximum-scale=1/)
    assert.match(indexHtml, /user-scalable=no/)
    assert.match(indexHtml, /name="format-detection" content="telephone=no, email=no, address=no"/)
    assert.match(indexHtml, /name="mobile-web-app-capable" content="yes"/)
    assert.match(indexHtml, /name="apple-mobile-web-app-capable" content="yes"/)
    assert.match(indexHtml, /name="apple-mobile-web-app-title" content="%VITE_APP_NAME%"/)
    assert.match(indexHtml, /name="apple-mobile-web-app-status-bar-style" content="black-translucent"/)
    assert.match(indexHtml, /name="theme-color" content="#040404"/)
    assert.match(indexHtml, /name="color-scheme" content="dark"/)
    assert.match(indexHtml, /<link rel="icon" type="image\/x-icon" href="\/favicon.ico" \/>/)
    assert.match(indexHtml, /<title>%VITE_APP_NAME%<\/title>/)
})

test('index html uses the project favicon from public assets', () => {
    assert.equal(existsSync('public/favicon.ico'), true)
    assert.doesNotMatch(indexHtml, /favicon\.svg/)
})

test('index html does not keep obsolete desktop compatibility meta', () => {
    assert.doesNotMatch(indexHtml, /X-UA-Compatible/)
})

test('index html does not include social share meta by default', () => {
    assert.doesNotMatch(indexHtml, /VITE_SOCIAL_/)
    assert.doesNotMatch(indexHtml, /name="description"/)
    assert.doesNotMatch(indexHtml, /rel="canonical"/)
    assert.doesNotMatch(indexHtml, /property="og:/)
    assert.doesNotMatch(indexHtml, /name="twitter:/)
})

test('vite config injects social share meta only when the env switch is enabled', () => {
    assert.match(viteConfig, /VITE_ENABLE_SOCIAL_META/)
    assert.match(viteConfig, /SOCIAL_META_ENABLED_VALUE = '1'/)
    assert.match(viteConfig, /createSocialMetaPlugin/)
    assert.match(viteConfig, /name: 'inject-social-meta'/)
    assert.match(viteConfig, /createMetaTag\('description'/)
    assert.match(viteConfig, /tag: 'link'/)
    assert.match(viteConfig, /createPropertyMetaTag\('og:type', 'website'\)/)
    assert.match(viteConfig, /createMetaTag\('twitter:card', 'summary_large_image'\)/)
})
