"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient();

export function Provider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                {...props}>{children}
            </NextThemesProvider>
        </QueryClientProvider>
    
    ); 
}
