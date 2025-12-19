import useSWR from "swr"

export function useCart() {

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
        data: carts, 
        error: cartsError, 
        isLoading, 
        mutate: mutateCart 
    } = useSWR<>(`/api/cart`, fetcher)

    return { carts, cartsError, isLoading, mutateCart}
}