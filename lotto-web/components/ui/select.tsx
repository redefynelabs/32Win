import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.ComponentProps<"select"> {
  label?: string
}

function Select({ className, label, children, ...props }: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  React.useEffect(() => {
    if (selectRef.current) {
      setHasValue(!!selectRef.current.value)
    }
  }, [props.value, props.defaultValue])

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className="relative w-full">
      <select
        ref={selectRef}
        data-slot="select"
        className={cn(
          "selection:bg-primary selection:text-primary-foreground border-input h-14 w-full min-w-0 rounded-[4px] border bg-transparent px-4 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none",
          !hasValue && "text-muted-foreground/60",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      
      {/* Dropdown arrow icon */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

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

export { Select }