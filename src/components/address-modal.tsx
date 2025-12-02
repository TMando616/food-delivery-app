'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { v4 as uuidv4 } from 'uuid';
import { Address, AddressResponse, AddressSuggestion } from "@/types"
import { AlertCircle, LoaderCircle, MapPin } from "lucide-react"
import { selectSuggestionAction } from "@/app/(private)/actions/addressActions"
import useSWR from "swr"

export default function AddressModal() {
    
    const [inputText, setInputText] = useState("")
    const [sessionToken, setSessionToken] = useState(uuidv4())
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const fetchSuggestions = useDebouncedCallback(async (input: string) => {
        if(!input.trim()) {
            setSuggestions([])
            return
        }
        setErrorMessage(null)
        try {
            const response = await fetch(
                `/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`
            )
            if(!response.ok) {
                const errorData = await response.json()
                setErrorMessage(errorData.error)
                return
            }
            const data: AddressSuggestion[] = await response.json();
            setSuggestions(data)
        } catch (error) {
            console.error(error)
            setErrorMessage("予期せぬエラーが発生しました")
        } finally {
            setIsLoading(false)
        }
    }, 500); 

    useEffect(() => {
        if(!inputText.trim()) {
            return
        }
        setIsLoading(true)
        fetchSuggestions(inputText);
    }, [inputText])

    const fetcher = (url:string) => fetch(url).then(res => res.json())

    const { data, error, isLoading:loading } = useSWR<AddressResponse>(`/api/address`, fetcher)
    console.log(data)

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
        
        try {
            // serverActions呼び出し
            await selectSuggestionAction(suggestion, sessionToken)
            setSessionToken(uuidv4()) // sessionTokenは使いまわせない
        } catch (error) {
            console.log(error)
            alert("予期せぬエラーが発生しました")
        }

    }

    return (
        <div>
            <Dialog>
                <DialogTrigger>住所を選択</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>住所</DialogTitle>
                        <DialogDescription className="sr-only">住所登録と選択</DialogDescription>
                    </DialogHeader>
                    <Command shouldFilter={false}>
                        <div className="bg-muted mb-4">
                            <CommandInput 
                                value={inputText}
                                onValueChange={setInputText} 
                                placeholder="Type a command or search..." 
                            />
                        </div>
                        <CommandList>
                            {inputText ? (
                                <>
                                    <CommandEmpty>
                                        <div className="flex items-center justify-center">
                                            {isLoading ? (
                                                <LoaderCircle className="animate-spin" />
                                            ) : errorMessage ?
                                            (
                                                <div className="flex items-center text-destructive gap-2">
                                                    <AlertCircle />
                                                    {errorMessage}
                                                </div>
                                            ) : (
                                                "住所が見つかりません"
                                            )}
                                        </div>
                                    </CommandEmpty>
                                    {suggestions.map((suggestion) => (
                                        <CommandItem 
                                            onSelect={() => handleSelectSuggestion(suggestion)}
                                            key={suggestion.placeId} 
                                            className="p-5"
                                        >
                                            <MapPin />
                                            <div>
                                                <p className="font-bold">{suggestion.placeName}</p>
                                                <p className="text-muted-foreground">{suggestion.address_text}</p>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <h3 className="font-black text-lg mb-2">保存済みの住所</h3>
                                    { data?.addressList.map((address: Address) => (
                                        <CommandItem className="p-5" key={address.id}>
                                            <div>
                                                <p className="font-bold">{address.name}</p>
                                                <p>{address.address_text}</p>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </>
                            )}
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </div>
    )
}
