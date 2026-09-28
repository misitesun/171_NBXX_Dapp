import { isFlutterBridgeReady } from './runtime.ts'

export function postMessageToFlutter(message: unknown): void {
    if (!isFlutterBridgeReady()) {
        throw new Error('Flutter Bridge 尚未准备完成')
    }

    const flutterBridge = window.Flutter

    if (flutterBridge?.postMessage === undefined) {
        throw new Error('Flutter Bridge 尚未准备完成')
    }

    flutterBridge.postMessage(JSON.stringify(message))
}
