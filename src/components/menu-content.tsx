"use client"

import { CategoryMenu } from "@/types";
import CategorySideBar from "./category-side-bar";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";
import { useState } from "react";
import { InView } from "react-intersection-observer";
import MenuModal from "./menu-modal";
import { useModal } from "@/app/context/modalContext";

interface MenuContentProps {
    categoryMenus: CategoryMenu[],
    restaurantId: string,
}

export default function MenuContent({categoryMenus, restaurantId}:MenuContentProps ) {

    const { isOpen, setIsOpen, openModal, closeModal, selectedItem } = useModal()

    const [activeCategoryId , setActiveCategoryId] = useState(categoryMenus[0].id)

    const handleSelectCategory = (categoryId: string) => {
        const element = document.getElementById(`${categoryId}-menu`)
        
        if(element) {
            element.scrollIntoView({behavior: "smooth"})
        }
    }
    return (
        <div className="flex gap-4">
            <CategorySideBar 
                categoryMenus={categoryMenus} 
                onSelectCategory={handleSelectCategory}
                activeCategoryId={activeCategoryId}
            />
            <div className="w-3/4">
                {categoryMenus.map((category) => (
                    <InView 
                        id={`${category.id}-menu`}  
                        key={category.id} 
                        className="scroll-mt-16"
                        onChange={(inView, entry) => inView && setActiveCategoryId(category.id)}
                        threshold={0.7}
                    >
                        <Section title={category.categoryName}>
                            {category.id === "featured" ? (
                                <CarouselContainer slideToShow={4}>
                                    {category.items.map((menu) => (
                                        <MenuCard menu={menu} key={menu.id} onClick={openModal}/>
                                    ))}
                                </CarouselContainer>
                            ): (
                                <div className="grid grid-cols-2 gap-4">
                                    {category.items.map((menu) => (
                                        <FlatMenuCard key={menu.id} menu={menu} onClick={openModal}/>
                                    ))}
                                </div>
                            )}
                        </Section>
                    </InView>
                ))}
            </div>

            <MenuModal isOpen={isOpen} closeModal={closeModal} selectedItem={selectedItem} restaurantId={restaurantId}/>
        </div>
    )
}
