import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
}

function Input({ className, type, label, placeholder, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      setHasValue(!!inputRef.current.value)
    }
  }, [props.value, props.defaultValue])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  const showPlaceholder = !hasValue

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground border-input h-14 w-full min-w-0 rounded-[4px] border bg-transparent px-4 py-2 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          label ? "placeholder:text-[14px] placeholder:text-muted-foreground/60" : "placeholder:text-muted-foreground",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        placeholder={showPlaceholder ? placeholder : ""}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {label && (
        <label
          className={cn(
            "text-muted-foreground pointer-events-none absolute left-2 top-1 -translate-y-1/2 bg-background px-1 text-lg font-regular"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export { Input }