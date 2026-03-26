import { PlusIcon, SearchIcon, Loader2Icon, AlertCircleIcon, InboxIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon } from "./ui/input-group";
import { cn } from "@/lib/utils";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
} from "./ui/empty";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "./ui/pagination";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

 type EntityHeaderProps =  {
    title : string;
    description ?: string;
    newButtonLabel ?: string;
    disabled ?: boolean;
    isCreating ?: boolean;
} & (
    | {onNew : ()=> void; newButtonHref ?: never}
    | {newButtonHref : string; onNew ?: never}
);

export const EntityHeader = ({
title,
description,
newButtonLabel, 
disabled, 
isCreating, 
onNew,
newButtonHref
}: EntityHeaderProps ) =>{

return (
    <div className="flex flex-row items-center justify-between gap-x-4 ">
        <div className="flex flex-col">
       <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
       {description && (
        <p className="text-xs md:text-sm text-muted-foreground">
            {description}
        </p>
       )}
    </div>
     {
        onNew && !newButtonHref && (
            <Button
            disabled={isCreating || disabled}
            size="sm"
            onClick={onNew}
            >
                <PlusIcon className="size-4 "/>
                {newButtonLabel}
            </Button>
        )
     }

 {
     newButtonHref && !onNew && (
            <Button
            size="sm"
            asChild
            >
                <Link href={newButtonHref} prefetch >
                <PlusIcon className="size-4 "/>
                {newButtonLabel}
                </Link>
            </Button>
        )
     }
    </div>
)
}



interface EntityContainerProps {
  header: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const EntityContainer = ({ 
  header, 
  search, 
  pagination, 
  children,
  className = ""
}: EntityContainerProps) => {
  return (
    <div className={`p-4 md:px-10 md:py-6 h-full ${className}`}>
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8  h-full">
        {header}

      <div className="flex flex-col gap-y-4 h-full ">
      {search}
      {children}
      </div>
      {pagination}
    </div>     
     </div>
  );
};


interface EntitySearchProps {
    value : string;
    onChange : (value : string) => void;
    placeholder ?: string;
    className ?: string;
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder = "Search...",
    className
}: EntitySearchProps) => {
    return (
        <div className={className}>
            <InputGroup className="h-9! rounded-lg! border-input/30 bg-input/30 shadow-none!">
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-auto! border-0! bg-transparent! shadow-none! focus-visible:border-0! focus-visible:ring-0!"
                />
                <InputGroupAddon align="inline-start">
                    <SearchIcon className="size-4 text-muted-foreground" />
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

interface EntityPaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const EntityPagination = ({
    page,
    pageSize,
    total,
    onPageChange,
    className
}: EntityPaginationProps) => {
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 3; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className || ''}`}>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) onPageChange(page - 1);
                            }}
                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                        pageNum === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(pageNum);
                                    }}
                                    isActive={pageNum === page}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) onPageChange(page + 1);
                            }}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                {total > 0 ? `${start}-${end} of ${total}` : 'No results'}
            </div>
        </div>
    );
}; 



interface StateViewProps {
    message ?: string;
};

interface LoadingViewProps extends StateViewProps {
    entity ?: string;
}

export const LoadingView = ({
    entity = "items",
    message
}: LoadingViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-20">
            <Loader2Icon className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin" />
            <p className="mt-6 text-sm md:text-base text-muted-foreground text-center">
                {message ?? `Loading ${entity}...`}
            </p>
        </div>
    );
};

interface ErrorViewProps extends StateViewProps {
    entity ?: string;
    onRetry ?: () => void;
}

export const ErrorView = ({
    entity = "items",
    message,
    onRetry
}: ErrorViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircleIcon className="w-7 h-7 md:w-8 md:h-8 text-destructive" />
            </div>
            <p className="mt-6 text-sm md:text-base text-muted-foreground text-center max-w-md">
                {message ?? `Failed to load ${entity}`}
            </p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                >
                    Try again
                </Button>
            )}
        </div>
    );
};

interface EmptyViewProps {
    entity?: string;
    title?: string;
    description?: string;
    onNew?: () => void;
}

export const EmptyView = ({
    entity = "items",
    title,
    description,
    onNew
}: EmptyViewProps) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <InboxIcon className="size-5 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>
                    {title ?? `No ${entity} found`}
                </EmptyTitle>
            </EmptyHeader>
            {description && (
                <EmptyDescription>
                    {description}
                </EmptyDescription>
            )}
            {onNew && (
                <EmptyContent>
                    <Button onClick={onNew}>
                        Create new
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
};

interface EmptyListProps {
    message?: string;
    className?: string;
}

export const EmptyList = ({
    message = "No results found",
    className
}: EmptyListProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 text-center",
                className
            )}
        >
            <InboxIcon className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
};


interface EntityListProps<T> {
    items : T[];
    renderItem : (item : T, index : number) => React.ReactNode;
    getKey ?: (item : T , index : number ) => string | number;
    emptyView?: React.ReactNode;
    className?: string;
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView = <EmptyList />,
    className,
}: EntityListProps<T>) {
    if (items.length === 0) {
        return <div className={cn("w-full", className)}>{emptyView}</div>;
    }

    return (
        <div className={cn("grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {items.map((item, index) => (
                <React.Fragment key={getKey?.(item, index) ?? index}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </div>
    );
}


interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className
}: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await onRemove?.();
        } catch (error) {
            // Error is handled by the onRemove callback
        }
    };

    return (
        <Link href={href} prefetch className="block group">
            <Card
                className={cn(
                    "group relative transition-all duration-200",
                    "hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5",
                    "active:scale-[0.98]",
                    className
                )}
            >
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-2.5">
                    <div className="flex items-start gap-3 sm:gap-4">
                        {image && (
                            <div className="flex shrink-0 items-center justify-center">
                                {image}
                            </div>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
                            <CardTitle className="text-sm sm:text-base font-medium leading-snug line-clamp-2 break-words group-hover:underline">
                                {title}
                            </CardTitle>
                            {subtitle && (
                                <CardDescription className="truncate text-xs sm:text-sm text-muted-foreground/80">
                                    {subtitle}
                                </CardDescription>
                            )}
                        </div>
                        {onRemove && (
                            <div className="flex shrink-0 items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="opacity-0 group-hover/card:opacity-100 transition-opacity -mr-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem
                                            onClick={handleRemove}
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            <Trash2Icon className="size-4 mr-2" />
                                            {isRemoving ? "Removing..." : "Remove"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </CardHeader>
                {actions && (
                    <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
                        <div className="mt-2 pt-2 sm:mt-3 sm:pt-2.5 border-t border-border/50">
                            <div className="flex flex-wrap gap-2">
                                {actions}
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
};