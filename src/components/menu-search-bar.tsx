"use client"
import { Search } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function MenuSearchBar() {

    const searchParams = useSearchParams()
    const pathName = usePathname()
    const { replace } = useRouter()

    const handleSearchMenu = useDebouncedCallback((inputText: string) => {
        const params = new URLSearchParams(searchParams)

        if(inputText.trim()) {
            params.set("searchMenu", inputText)
        } else {
            params.delete("searchMenu")
        }
        const query = params.toString()

        replace(query ? `${pathName}?${query}` : `${pathName}`)

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
