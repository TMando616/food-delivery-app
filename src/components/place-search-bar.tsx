"use client"

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { RestaurantSuggestion } from "@/types";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

export default function PlaceSearchBar() {

    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState("")
    const [sessionToken, setSessionToken] = useState(uuidv4())
    const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchSuggestions = useDebouncedCallback(async (input: string) => {
        if(!inputText.trim()) {
            setSuggestions([])
            return
        }
        try {
            const response = await fetch(
                `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`
            )
            const data:RestaurantSuggestion[] = await response.json();
            setSuggestions(data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, 500); 

    useEffect(() => {
        if(!inputText.trim()) {
            setOpen(false) // 要確認：react18からはeffect内でstateを変更する処理はエラーが出るみたい
            return
        }
        setIsLoading(true)
        setOpen(true)
        fetchSuggestions(inputText);
    }, [inputText])

    const handleBlur = () => {
        setOpen(false)
    }

    const handleFocus = () => {
        if(inputText){
            setOpen(true)
        }
    }

    return (
        <Command className="overflow-visible bg-muted" shouldFilter={false}>
            <CommandInput 
                value={inputText}
                placeholder="Type a command or search..."
                onValueChange={setInputText}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            {open && (
                <div className="relative">
                    <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
                        <CommandEmpty>
                            <div className="flex items-center justify-center">
                                {isLoading ? <LoaderCircle className="animate-spin" /> : "レストランが見つかりません"}
                            </div>
                        </CommandEmpty>
                        {suggestions.map((suggestion, index) => (
                            <CommandItem 
                                key={suggestion.placeId ?? index} 
                                value={suggestion.placeName}
                                className="p-5"
                            >
                                {suggestion.type === "queryPrediction" ? <Search /> : <MapPin />}
                                <p>{suggestion.placeName}</p>
                            </CommandItem>
                        ))}
                    </CommandList>
                </div>
            )}
        </Command>
    )
}
