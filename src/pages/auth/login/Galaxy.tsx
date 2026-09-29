import { useEffect, useRef } from 'react'
import { fragmentShader, vertexShader } from './galaxyShaders.ts'

// Same shaders and uniform values as HU_CHAIN; native WebGL avoids adding ogl.
export default function Galaxy() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
        if (!gl) return
        const resources: WebGLShader[] = []
        const program = gl.createProgram()
        const buffer = gl.createBuffer()
        if (!program || !buffer) return
        function compile(type: number, source: string) {
            const shader = gl?.createShader(type)
            if (!shader || !gl) throw new Error('WebGL unavailable')
            resources.push(shader)
            gl.shaderSource(shader, source); gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable')
            return shader
        }
        try {
            gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader))
            gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader))
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program unavailable')
        } catch {
            resources.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); gl.deleteBuffer(buffer)
            return
        }
        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]), gl.STATIC_DRAW)
        for (const [name, offset] of [['position', 0], ['uv', 8]] as const) {
            const attribute = gl.getAttribLocation(program, name)
            gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 16, offset)
        }
        const uniform = (name: string) => gl.getUniformLocation(program, name)
        const values = {
            uDensity: 1.5, uHueShift: 240, uSpeed: 0.5, uGlowIntensity: 0.5,
            uSaturation: 0.8, uTwinkleIntensity: 0.3, uRotationSpeed: 0.1,
            uRepulsionStrength: 1, uAutoCenterRepulsion: 0, uLightMode: 0,
        }
        for (const [name, value] of Object.entries(values)) gl.uniform1f(uniform(name), value)
        gl.uniform1i(uniform('uMouseRepulsion'), 1); gl.uniform1i(uniform('uTransparent'), 1)
        gl.uniform2f(uniform('uFocal'), 0.5, 0.5); gl.uniform2f(uniform('uRotation'), 1, 0)
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0)
        let frame = 0
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
        const target = { x: 0.5, y: 0.5, active: 0 }
        const mouse = { ...target }
        function resize() {
            if (!canvas || !gl) return
            canvas.width = Math.max(1, canvas.clientWidth); canvas.height = Math.max(1, canvas.clientHeight)
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform3f(uniform('uResolution'), canvas.width, canvas.height, canvas.width / canvas.height)
        }
        function draw(time: number) {
            if (!gl) return
            const seconds = motion.matches ? 0 : time * 0.001
            gl.uniform1f(uniform('uTime'), seconds); gl.uniform1f(uniform('uStarSpeed'), seconds * 0.5 / 10)
            mouse.x += (target.x - mouse.x) * 0.05; mouse.y += (target.y - mouse.y) * 0.05
            mouse.active += (target.active - mouse.active) * 0.05
            gl.uniform2f(uniform('uMouse'), mouse.x, mouse.y); gl.uniform1f(uniform('uMouseActiveFactor'), mouse.active)
            gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3)
            if (!document.hidden && !motion.matches) frame = requestAnimationFrame(draw)
        }
        function synchronize() { cancelAnimationFrame(frame); if (!document.hidden) draw(performance.now()) }
        function move(event: MouseEvent) {
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            target.x = (event.clientX - rect.left) / rect.width
            target.y = 1 - (event.clientY - rect.top) / rect.height
            target.active = 1
        }
        function leave() { target.active = 0 }
        function handleResize() { resize(); synchronize() }
        resize(); synchronize()
        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', move, { passive: true })
        window.addEventListener('blur', leave)
        document.addEventListener('visibilitychange', synchronize)
        motion.addEventListener('change', synchronize)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', move)
            window.removeEventListener('blur', leave); document.removeEventListener('visibilitychange', synchronize)
            motion.removeEventListener('change', synchronize)
            resources.forEach(shader => gl.deleteShader(shader)); gl.deleteBuffer(buffer); gl.deleteProgram(program)
            // React StrictMode reuses this canvas for the next effect. Releasing
            // its GL resources is safe; losing the context here would break the remount.
        }
    }, [])
    return <canvas ref={canvasRef} />
}
