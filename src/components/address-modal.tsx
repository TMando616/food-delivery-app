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
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { v4 as uuidv4 } from 'uuid';
import { Address, AddressResponse, AddressSuggestion } from "@/types"
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react"
import { deleteAddressAction, selectAddressAction, selectSuggestionAction } from "@/app/(private)/actions/addressActions"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function AddressModal() {
    
    const [inputText, setInputText] = useState("")
    const [sessionToken, setSessionToken] = useState(uuidv4())
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

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

    const fetcher = async (url:string) => {
        const response = await fetch(url)

        if(!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error)
        }

        const data = await response.json()
        return data

    }

    const { 
        data, 
        error, 
        isLoading:loading, 
        mutate 
    } = useSWR<AddressResponse>(`/api/address`, fetcher)

    if (error) {
        console.error(error)
        return <div>{error.message}</div>
    }
    if (loading) return <div>loading...</div>

    const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
        
        try {
            // serverActions呼び出し
            await selectSuggestionAction(suggestion, sessionToken)
            setSessionToken(uuidv4()) // sessionTokenは使いまわせない
            setInputText("")
            mutate()
        } catch (error) {
            console.log(error)
            alert("予期せぬエラーが発生しました")
        }

    }

    const handleSelectAdrress = async (address: Address) => {
        try {
            await selectAddressAction(address.id)
            mutate()
            setOpen(false)
        } catch(error) {
            console.log(error)
            alert("予期せぬエラーが発生しました")
        }
    }

    const handleDeleteAddress = async (addressId: number) => {
        const ok = window.confirm("この住所を削除しますか?")
        if(!ok) return

        try {
            await deleteAddressAction(addressId)
            mutate()
        } catch(error) {
            console.log(error)
            alert("予期せぬエラーが発生しました")
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
                <DialogTrigger>{data?.selectedAddress ? data.selectedAddress.name : "住所を選択"}</DialogTrigger>
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
                                        <CommandItem 
                                            onSelect={() => handleSelectAdrress(address)}
                                            className={cn(
                                                "p-5 justify-between items-center", 
                                                address.id === data.selectedAddress?.id && "bg-muted"
                                            )} 
                                            key={address.id}>
                                            <div>
                                                <p className="font-bold">{address.name}</p>
                                                <p>{address.address_text}</p>
                                            </div>
                                            <Button onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteAddress(address.id)
                                            }} size={"icon"} variant={"ghost"}>
                                                <Trash2 />
                                            </Button>
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
