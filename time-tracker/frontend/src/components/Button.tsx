interface ButtonProps {
    onClick?: () => void
    disabled?: boolean
    children?: any
}

export function MainButton({ onClick, disabled = false, children }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`cursor-pointer px-8 py-3 rounded-md font-semibold text-white transition-all duration-300 bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    )
}

export function RedButton({ onClick, disabled, children }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`cursor-pointer px-8 py-3 rounded-md font-semibold text-white transition-all duration-300 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    )
}
