import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "./button"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onClose?: () => void
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const dialogRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => dialogRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (dialogRef.current) {
        dialogRef.current.focus()
      }
    }, [])

    return (
      <div
        ref={dialogRef}
        className={cn(
          "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300",
          "border border-gray-200/50",
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 rounded-full opacity-70 hover:opacity-100 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
        {children}
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4 pr-8", className)}
    {...props}
  />
)

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-bold leading-none tracking-tight text-gray-900", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 mt-2", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-6 pt-4 border-t border-gray-200", className)}
    {...props}
  />
)

const DialogClose = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="transition-all hover:scale-105"
  >
    Cancel
  </Button>
)

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
