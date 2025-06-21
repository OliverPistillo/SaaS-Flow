import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Pagination = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef(({
  className,
  isActive,
  size = "icon",
  disabled,
  onClick,
  children,
  href,
  ...props
}, ref) => {
  const Component = href ? "a" : "button"
  
  return (
    <Component
      ref={ref}
      href={href}
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        size === "icon" ? "h-10 w-10" : "h-10 px-4 py-2",
        isActive 
          ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef(({
  className,
  disabled,
  onClick,
  href,
  ...props
}, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Vai alla pagina precedente"
    size="default"
    disabled={disabled}
    onClick={onClick}
    href={href}
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Precedente</span>
  </PaginationLink>
))
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef(({
  className,
  disabled,
  onClick,
  href,
  ...props
}, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Vai alla pagina successiva"
    size="default"
    disabled={disabled}
    onClick={onClick}
    href={href}
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Successivo</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
))
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = React.forwardRef(({
  className,
  ...props
}, ref) => (
  <span
    ref={ref}
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Altre pagine</span>
  </span>
))
PaginationEllipsis.displayName = "PaginationEllipsis"

// Componente helper per paginazione completa
const PaginationWrapper = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPreviousNext = true,
  maxVisiblePages = 5,
  className,
  ...props
}) => {
  const generatePageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)
    
    // Aggiusta i limiti se necessario
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }
    
    // Aggiungi prima pagina e ellipsis se necessario
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }
    }
    
    // Aggiungi pagine visibili
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Aggiungi ellipsis e ultima pagina se necessario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  const pages = generatePageNumbers()

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        {showPreviousNext && (
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}
        
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === 'string' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {showPreviousNext && (
          <PaginationItem>
            <PaginationNext
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationWrapper,
}