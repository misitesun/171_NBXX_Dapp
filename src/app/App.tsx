import { HttpErrorToast } from '../components/Toast/index.ts'
import { AppRouter } from '../router/index.ts'

function App() {
    return (
        <>
            <HttpErrorToast />
            <AppRouter />
        </>
    )
}

export default App
