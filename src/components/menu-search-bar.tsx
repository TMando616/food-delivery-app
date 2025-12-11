"use client"
import { Search } from 'lucide-react'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function MenuSearchBar() {

    const handleSearchMenu = useDebouncedCallback((inputText: string) => {
            console.log(inputText)
    }, 500)
    
    return (
        <div className='flex items-center bg-muted rounded-full'>
            <Search size={20} color='gray' className='ml-2' />
            <input 
                type="text" 
                placeholder='Search Menu'
                className='flex-1 px-4 py-2 outline-none'
                onChange={(e) => handleSearchMenu(e.target.value)}
            />
        </div>
    )
}
