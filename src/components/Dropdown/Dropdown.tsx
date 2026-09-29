import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { Icon } from '@/components/Icon'
import { getViewportWidthPx } from '@/shared/viewport/getViewportWidthPx'

import './Dropdown.scss'

const PANEL_VIEWPORT_GUTTER = 24
const PANEL_OFFSET = 12

export type DropdownValue = string | number
export type DropdownContentAlign = 'left' | 'center' | 'right'

export interface DropdownOption {
    value: DropdownValue
    label: ReactNode
    icon?: ReactNode
    disabled?: boolean
}

export interface DropdownTriggerRenderProps {
    setTriggerElement: (element: HTMLElement | null) => void
    isOpen: boolean
    isDisabled: boolean
    panelId: string
    onToggle: () => void
}

export interface DropdownProps {
    options: readonly DropdownOption[]
    value?: DropdownValue
    defaultValue?: DropdownValue
    open?: boolean
    defaultOpen?: boolean
    placeholder?: ReactNode
    triggerLabel?: ReactNode
    contentAlign?: DropdownContentAlign
    showIcon?: boolean
    showArrow?: boolean
    disabled?: boolean
    className?: string
    triggerClassName?: string
    maskClassName?: string
    panelClassName?: string
    renderTrigger?: (props: DropdownTriggerRenderProps) => ReactNode
    onChange?: (value: DropdownValue, option: DropdownOption) => void
    onOpenChange?: (open: boolean) => void
}

interface DropdownPanelPosition {
    top: number
    left: number
}

function getContentAlignClassName(
    element: 'trigger' | 'option',
    contentAlign: DropdownContentAlign,
): string {
    return ['dropdown__', element, '--align-', contentAlign].join('')
}

export function Dropdown({
    options,
    value,
    defaultValue,
    open,
    defaultOpen = false,
    placeholder,
    triggerLabel,
    contentAlign = 'left',
    showIcon = true,
    showArrow = false,
    disabled = false,
    className = '',
    triggerClassName = '',
    maskClassName = '',
    panelClassName = '',
    renderTrigger,
    onChange,
    onOpenChange,
}: DropdownProps) {
    const { t } = useTranslation()
    const triggerRef = useRef<HTMLElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const panelId = useId()
    const isValueControlled = value !== undefined
    const isOpenControlled = open !== undefined
    const [innerValue, setInnerValue] = useState<DropdownValue | undefined>(defaultValue)
    const [innerOpen, setInnerOpen] = useState(defaultOpen)
    const [panelPosition, setPanelPosition] = useState<DropdownPanelPosition | null>(null)
    const setTriggerElement = useCallback((element: HTMLElement | null) => {
        triggerRef.current = element
    }, [])

    const currentValue = isValueControlled ? value : innerValue
    const isOpen = isOpenControlled ? open : innerOpen
    const selectedOption = options.find((option) => option.value === currentValue)
    const hasOptionIcon = showIcon && options.some((option) => option.icon !== undefined)
    const isTriggerDisabled = disabled || options.length === 0
    const triggerText = triggerLabel ?? selectedOption?.label ?? placeholder ?? t('请选择')

    const dropdownClassName = [
        'dropdown',
        isOpen ? 'dropdown--open' : '',
        className,
    ].filter(Boolean).join(' ')
    const triggerButtonClassName = [
        'dropdown__trigger',
        getContentAlignClassName('trigger', contentAlign),
        triggerClassName,
    ].filter(Boolean).join(' ')
    const panelClassNames = [
        'dropdown__panel',
        panelClassName,
    ].filter(Boolean).join(' ')
    const maskClassNames = [
        'dropdown__mask',
        maskClassName,
    ].filter(Boolean).join(' ')

    function setDropdownOpen(nextOpen: boolean) {
        if (!isOpenControlled) {
            setInnerOpen(nextOpen)
        }

        onOpenChange?.(nextOpen)
    }

    function closeDropdown() {
        setDropdownOpen(false)
        triggerRef.current?.focus()
    }

    function handleTriggerClick() {
        if (isTriggerDisabled) return

        if (!isOpen) {
            setPanelPosition(null)
        }

        setDropdownOpen(!isOpen)
    }

    function handleOptionClick(option: DropdownOption) {
        if (option.disabled) return

        if (!isValueControlled) {
            setInnerValue(option.value)
        }

        onChange?.(option.value, option)
        closeDropdown()
    }

    useEffect(() => {
        if (!isOpen) {
            setPanelPosition(null)
            return
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return

            event.preventDefault()

            if (!isOpenControlled) {
                setInnerOpen(false)
            }

            onOpenChange?.(false)
            triggerRef.current?.focus()
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, isOpenControlled, onOpenChange])

    useLayoutEffect(() => {
        if (!isOpen) return

        function updatePanelPosition() {
            const triggerElement = triggerRef.current
            const panelElement = panelRef.current
            if (!triggerElement || !panelElement) return

            const triggerRect = triggerElement.getBoundingClientRect()
            const panelRect = panelElement.getBoundingClientRect()
            const viewportWidth = document.documentElement.clientWidth
            const viewportHeight = window.innerHeight
            const viewportGutter = getViewportWidthPx(PANEL_VIEWPORT_GUTTER)
            const panelOffset = getViewportWidthPx(PANEL_OFFSET)
            const panelWidth = Math.min(
                panelRect.width,
                Math.max(0, viewportWidth - viewportGutter * 2),
            )
            const panelHeight = Math.min(
                panelRect.height,
                Math.max(0, viewportHeight - viewportGutter * 2),
            )
            const minLeft = viewportGutter
            const maxLeft = Math.max(
                minLeft,
                viewportWidth - viewportGutter - panelWidth,
            )
            const belowTop = triggerRect.bottom + panelOffset
            const aboveTop = triggerRect.top - panelOffset - panelHeight
            const preferredTop = belowTop + panelHeight <= viewportHeight - viewportGutter
                ? belowTop
                : aboveTop >= viewportGutter
                    ? aboveTop
                    : belowTop
            const minTop = viewportGutter
            const maxTop = Math.max(
                minTop,
                viewportHeight - viewportGutter - panelHeight,
            )
            const nextPosition = {
                top: Math.min(Math.max(preferredTop, minTop), maxTop),
                left: Math.min(Math.max(triggerRect.left, minLeft), maxLeft),
            }

            setPanelPosition((currentPosition) => {
                if (
                    currentPosition?.top === nextPosition.top
                    && currentPosition.left === nextPosition.left
                ) {
                    return currentPosition
                }

                return nextPosition
            })
        }

        updatePanelPosition()
        window.addEventListener('resize', updatePanelPosition)
        window.addEventListener('scroll', updatePanelPosition, true)

        return () => {
            window.removeEventListener('resize', updatePanelPosition)
            window.removeEventListener('scroll', updatePanelPosition, true)
        }
    }, [contentAlign, currentValue, hasOptionIcon, isOpen, options, triggerLabel])

    const panelStyle: CSSProperties = panelPosition
        ? panelPosition
        : {
            visibility: 'hidden',
            pointerEvents: 'none',
        }

    return (
        <>
            {renderTrigger
                ? renderTrigger({
                    setTriggerElement,
                    isOpen,
                    isDisabled: isTriggerDisabled,
                    panelId,
                    onToggle: handleTriggerClick,
                })
                : (
                    <div className={dropdownClassName}>
                        <button
                            ref={setTriggerElement}
                            type="button"
                            className={triggerButtonClassName}
                            disabled={isTriggerDisabled}
                            aria-haspopup="listbox"
                            aria-controls={isOpen ? panelId : undefined}
                            aria-expanded={isOpen}
                            onClick={handleTriggerClick}
                        >
                            <span className="dropdown__trigger-label word-ellipsis-1">
                                {triggerText}
                            </span>

                            {showArrow ? (
                                <Icon
                                    name="arrow-down"
                                    className="dropdown__trigger-arrow"
                                />
                            ) : null}
                        </button>
                    </div>
                )}

            {isOpen && typeof document !== 'undefined'
                ? createPortal(
                    <>
                        <button
                            type="button"
                            className={maskClassNames}
                            aria-label={t('关闭下拉菜单')}
                            onClick={closeDropdown}
                        />

                        <div
                            ref={panelRef}
                            id={panelId}
                            role="listbox"
                            aria-label={t('下拉选项')}
                            className={panelClassNames}
                            style={panelStyle}
                        >
                            {options.map((option) => {
                                const isSelected = option.value === currentValue
                                const optionClassName = [
                                    'dropdown__option',
                                    getContentAlignClassName('option', contentAlign),
                                    isSelected ? 'dropdown__option--selected' : '',
                                ].filter(Boolean).join(' ')

                                return (
                                    <button
                                        key={String(option.value)}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        className={optionClassName}
                                        disabled={option.disabled}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        {hasOptionIcon ? (
                                            <span
                                                className="dropdown__option-icon"
                                                aria-hidden="true"
                                            >
                                                {option.icon}
                                            </span>
                                        ) : null}
                                        <span className="dropdown__option-label word-ellipsis-1">
                                            {option.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </>,
                    document.body,
                )
                : null}
        </>
    )
}
