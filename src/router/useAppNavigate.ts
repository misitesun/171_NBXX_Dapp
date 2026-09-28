import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { createRouteNavigator } from './navigation.ts'

export function useAppNavigate() {
    const navigate = useNavigate()

    return useMemo(() => createRouteNavigator(navigate), [navigate])
}
