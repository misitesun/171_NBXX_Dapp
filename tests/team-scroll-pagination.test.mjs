import test from 'node:test'
import assert from 'node:assert/strict'
import { registerUiModules } from './hu-ui-render.mjs'

const hooks = registerUiModules()
const { observeTeamScroll } = await import('../src/pages/main/home/teamScrollPagination.ts')

for (const withObserver of [true, false]) {
    test(`team container pagination ${withObserver ? 'with observer' : 'fallback'} requires fresh scrolling and awaits one request`, async () => {
        const previous = globalThis.window
        const observers = []
        class Observer {
            constructor(callback, options) { this.callback = callback; this.options = options; observers.push(this) }
            observe(target) { this.target = target }
            disconnect() { this.disconnected = true }
            emit() { this.callback([{ isIntersecting: true }]) }
        }
        globalThis.window = { IntersectionObserver: withObserver ? Observer : undefined }
        const root = Object.assign(new EventTarget(), { scrollTop: 800, clientHeight: 200, scrollHeight: 1000 })
        const sentinel = new EventTarget()
        let calls = 0
        let release
        const load = () => { calls += 1; return new Promise(resolve => { release = resolve }) }
        const settle = async () => { release(); await Promise.resolve(); await Promise.resolve() }
        let dispose = observeTeamScroll(root, sentinel, load)
        try {
            observers[0]?.emit()
            assert.equal(calls, 0, 'historical bottom position and initial observer callback do not load')
            if (withObserver) {
                assert.equal(observers[0].options.root, root)
                assert.equal(observers[0].target, sentinel)
            }
            root.scrollTop = 100
            root.dispatchEvent(new Event('scroll'))
            observers[0]?.emit()
            assert.equal(calls, 0, 'scrolling far from container bottom does not load')
            root.scrollTop = 800
            root.dispatchEvent(new Event('scroll'))
            assert.equal(calls, 1)
            root.dispatchEvent(new Event('scroll'))
            observers[0]?.emit()
            assert.equal(calls, 1, 'pending request synchronously blocks duplicates')
            await settle()
            observers[0]?.emit()
            assert.equal(calls, 1, 'request completion does not cause observer-driven retry loops')
            root.dispatchEvent(new Event('scroll'))
            assert.equal(calls, 2, 'new scrolling permits the next request')
            dispose()
            await settle()
            root.dispatchEvent(new Event('scroll'))
            observers[0]?.emit()
            assert.equal(calls, 2, 'disposed registration cannot load after data-set replacement')
            dispose = observeTeamScroll(root, sentinel, load)
            observers[1]?.emit()
            assert.equal(calls, 2, 'replacement registration is disarmed even at historical bottom')
            root.dispatchEvent(new Event('scroll'))
            assert.equal(calls, 3)
            await settle()
        } finally { dispose(); globalThis.window = previous }
    })
}

test.after(() => hooks.deregister())
