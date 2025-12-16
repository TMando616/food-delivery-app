"use server"

import { Menu } from "@/types";

export async function addToCartAction(selectedItem: Menu, quantity: number, restaurantId: string) {
    console.log(selectedItem, quantity, restaurantId)
}