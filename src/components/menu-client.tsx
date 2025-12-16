"use client"

import { useModal } from '@/app/context/modalContext'
import CarouselContainer from './carousel-container'
import MenuCard from './menu-card'
import { Menu } from '@/types'
import Link from 'next/link'

interface MenuClientProps {
    restaurantId: string,
    menus: Menu[]
}

export default function MenuClient({restaurantId,  menus} : MenuClientProps) {
    const { openModal } = useModal()
    return (
        <div>
            <CarouselContainer slideToShow={6}>
                {menus.map((menu) => (
                    <Link key={menu.id} href={`/restaurant/${restaurantId}`}>
                        <MenuCard menu={menu} onClick={openModal} />
                    </Link>
                ))}
            </CarouselContainer>
        </div>
    )
}
