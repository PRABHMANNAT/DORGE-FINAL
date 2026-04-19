"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface IngenLogoProps {
    className?: string
    size?: number
}

export function IngenLogo({ className, size = 40 }: IngenLogoProps) {
    return (
        <img
            src="/ingen-logo.svg"
            alt="Ingen"
            width={size}
            height={size}
            className={cn("object-contain", className)}
        />
    )
}
