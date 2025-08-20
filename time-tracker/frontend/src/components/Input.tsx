interface InputProps {
    id?: string
    value?: string
    placeholder?: string
    onChange?: (newValue: string) => void
}
export function TextInput({ id, value, placeholder, onChange }: InputProps) {
    return (
        <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange ? onChange(e.target.value) : null} type="text"
            className="p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    )
}
