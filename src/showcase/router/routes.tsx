import {
    createElement,
    lazy,
    Suspense,
    type ReactElement,
} from 'react'
import { Route } from 'react-router'

import { SHOWCASE_ROUTE_PATH } from './config.ts'

function createShowcaseRouteElements(): ReactElement[] {
    const showcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/Showcase.tsx')

        return { default: page.ShowcasePage }
    })
    const componentsRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/index.tsx')

        return { default: page.ComponentsPage }
    })
    const stylesRoutePage = lazy(async () => {
        const page = await import('@/showcase/styles/index.tsx')

        return { default: page.StylesPage }
    })
    const popupShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/popup/PopupShowcasePage.tsx')

        return { default: page.PopupShowcasePage }
    })
    const pickerShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/picker/PickerShowcasePage.tsx')

        return { default: page.PickerShowcasePage }
    })
    const dropdownShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/dropdown/DropdownShowcasePage.tsx')

        return { default: page.DropdownShowcasePage }
    })
    const iconShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/icon/IconShowcasePage.tsx')

        return { default: page.IconShowcasePage }
    })
    const emptyShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/empty/EmptyShowcasePage.tsx')

        return { default: page.EmptyShowcasePage }
    })
    const languageSwitchShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/language-switch/LanguageSwitchShowcasePage.tsx')

        return { default: page.LanguageSwitchShowcasePage }
    })
    const contractLoadingShowcaseRoutePage = lazy(async () => {
        const page = await import('@/showcase/components/contract-loading/ContractLoadingShowcasePage.tsx')

        return { default: page.ContractLoadingShowcasePage }
    })
    const layoutStylesRoutePage = lazy(async () => {
        const page = await import('@/showcase/styles/layout/LayoutStylesPage.tsx')

        return { default: page.LayoutStylesPage }
    })
    const textStylesRoutePage = lazy(async () => {
        const page = await import('@/showcase/styles/text/TextStylesPage.tsx')

        return { default: page.TextStylesPage }
    })
    const spacingStylesRoutePage = lazy(async () => {
        const page = await import('@/showcase/styles/spacing/SpacingStylesPage.tsx')

        return { default: page.SpacingStylesPage }
    })
    const buttonStylesRoutePage = lazy(async () => {
        const page = await import('@/showcase/styles/button/ButtonStylesPage.tsx')

        return { default: page.ButtonStylesPage }
    })

    const gradientTextPage = lazy(async () => {
        const page = await import('@/showcase/components/gradient-text/GradientTextShowcasePage')
        return { default: page.GradientTextShowcasePage }
    })

    return [
        <Route key={SHOWCASE_ROUTE_PATH.gradientText} path={SHOWCASE_ROUTE_PATH.gradientText}
            element={<Suspense fallback={null}>{createElement(gradientTextPage)}</Suspense>} />,
        <Route
            key={SHOWCASE_ROUTE_PATH.home}
            path={SHOWCASE_ROUTE_PATH.home}
            element={(
                <Suspense fallback={null}>
                    {createElement(showcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.components}
            path={SHOWCASE_ROUTE_PATH.components}
            element={(
                <Suspense fallback={null}>
                    {createElement(componentsRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.styles}
            path={SHOWCASE_ROUTE_PATH.styles}
            element={(
                <Suspense fallback={null}>
                    {createElement(stylesRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.popup}
            path={SHOWCASE_ROUTE_PATH.popup}
            element={(
                <Suspense fallback={null}>
                    {createElement(popupShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.picker}
            path={SHOWCASE_ROUTE_PATH.picker}
            element={(
                <Suspense fallback={null}>
                    {createElement(pickerShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.dropdown}
            path={SHOWCASE_ROUTE_PATH.dropdown}
            element={(
                <Suspense fallback={null}>
                    {createElement(dropdownShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.icon}
            path={SHOWCASE_ROUTE_PATH.icon}
            element={(
                <Suspense fallback={null}>
                    {createElement(iconShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.empty}
            path={SHOWCASE_ROUTE_PATH.empty}
            element={(
                <Suspense fallback={null}>
                    {createElement(emptyShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.languageSwitch}
            path={SHOWCASE_ROUTE_PATH.languageSwitch}
            element={(
                <Suspense fallback={null}>
                    {createElement(languageSwitchShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.contractLoading}
            path={SHOWCASE_ROUTE_PATH.contractLoading}
            element={(
                <Suspense fallback={null}>
                    {createElement(contractLoadingShowcaseRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.styleLayout}
            path={SHOWCASE_ROUTE_PATH.styleLayout}
            element={(
                <Suspense fallback={null}>
                    {createElement(layoutStylesRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.styleText}
            path={SHOWCASE_ROUTE_PATH.styleText}
            element={(
                <Suspense fallback={null}>
                    {createElement(textStylesRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.styleSpacing}
            path={SHOWCASE_ROUTE_PATH.styleSpacing}
            element={(
                <Suspense fallback={null}>
                    {createElement(spacingStylesRoutePage)}
                </Suspense>
            )}
        />,
        <Route
            key={SHOWCASE_ROUTE_PATH.styleButton}
            path={SHOWCASE_ROUTE_PATH.styleButton}
            element={(
                <Suspense fallback={null}>
                    {createElement(buttonStylesRoutePage)}
                </Suspense>
            )}
        />,
    ]
}

export const SHOWCASE_ROUTE_ELEMENTS = import.meta.env.DEV
    ? createShowcaseRouteElements()
    : []
