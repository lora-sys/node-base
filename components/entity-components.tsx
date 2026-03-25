import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon } from "./ui/input-group";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "./ui/pagination";

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