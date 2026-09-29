import {
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react'

import {
    Dropdown,
    type DropdownOption,
    type DropdownTriggerRenderProps,
} from '@/components/Dropdown'
import { Icon } from '@/components/Icon'
import { APP_CONFIG } from '@/config/index.ts'
import { changeAppLanguage } from '@/i18n/changeAppLanguage.ts'
import { APP_LANGUAGES } from '@/i18n/config.ts'
import { useAppStore } from '@/stores/app/store.ts'

import './LanguageSwitch.scss'

export interface LanguageSwitchProps {
    children?: ReactNode
    className?: string
    onOpen?: () => void
}

const LANGUAGE_DROPDOWN_OPTIONS: readonly DropdownOption[] = APP_LANGUAGES.map(
    (language) => ({
        label: language.name,
        value: language.code,
    }),
)

export function LanguageSwitch(props: LanguageSwitchProps) {
    if (!APP_CONFIG.enableI18n) {
        return <div style={{ display: 'none' }} />
    }

    return <LanguageSwitchContent {...props} />
}

function LanguageSwitchContent({
    children,
    className = '',
    onOpen,
}: LanguageSwitchProps) {
    const languageCode = useAppStore((state) => state.languageCode)
    const [isChangingLanguage, setIsChangingLanguage] = useState(false)
    const classes = ['language-switch', className]
        .filter(Boolean)
        .join(' ')
    const triggerContent = children === undefined ? (
        <Icon name="language" className="language-switch__default" ariaLabel="Language" />
    ) : children

    function handleLanguageSwitchKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== 'Enter' && event.key !== ' ') return

        event.preventDefault()
        event.currentTarget.click()
    }

    function handleDropdownOpenChange(isOpen: boolean) {
        if (isOpen) {
            onOpen?.()
        }
    }

    async function handleLanguageChange(nextLanguageCode: string) {
        if (isChangingLanguage || nextLanguageCode === languageCode) return

        setIsChangingLanguage(true)
        const changed = await changeAppLanguage(nextLanguageCode)
        if (!changed) {
            setIsChangingLanguage(false)
            return
        }

        if (typeof window !== 'undefined') {
            window.location.reload()
            return
        }

        setIsChangingLanguage(false)
    }

    function renderLanguageTrigger({
        setTriggerElement,
        isOpen,
        isDisabled,
        panelId,
        onToggle,
    }: DropdownTriggerRenderProps) {
        return (
            <div
                ref={setTriggerElement}
                className={classes}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                aria-haspopup="listbox"
                aria-controls={isOpen ? panelId : undefined}
                aria-expanded={isOpen}
                aria-disabled={isDisabled || undefined}
                onClick={onToggle}
                onKeyDown={handleLanguageSwitchKeyDown}
            >
                {triggerContent}
            </div>
        )
    }

    return (
        <Dropdown
            options={LANGUAGE_DROPDOWN_OPTIONS}
            value={languageCode}
            showIcon={false}
            disabled={isChangingLanguage}
            maskClassName="language-switch__mask"
            panelClassName="language-switch__panel"
            renderTrigger={renderLanguageTrigger}
            onChange={(nextValue) => {
                if (typeof nextValue !== 'string') return

                void handleLanguageChange(nextValue)
            }}
            onOpenChange={handleDropdownOpenChange}
        />
    )
}
