import { Button } from '@/components/ui/button'
import { getPlaceDetails } from '@/lib/restaurants/api'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default async function RestaurantPage({params, searchParams} : {
  params: Promise<{restaurantId: string }>
  searchParams: Promise<{sessionToken: string }>
}) {
  const { restaurantId } = await params
  const { sessionToken } = await searchParams
  const data = await getPlaceDetails(restaurantId, ["displayName","photos","primaryType"], sessionToken)
  console.log(data)
  return (
    <div>
      <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
        <Image 
          src={"/no_image.png"}
          fill
          alt={"レストラン画像"}
          className="object-cover"
          priority
          sizes={"(max-width: 1200px) 100vw, 1200px"}
        />
        <Button
          size="icon"
          variant="outline"
          className='absolute top-4 right-4 shadow rounded-full'
        >
          <Heart color='gray' strokeWidth={3} size={15} />
        </Button>
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <div>
          <h1 className='text-3l font-bold'>レストラン名</h1>
        </div>
        <div className='flex-1'>
          <div className='ml-auto w-80 bg-yellow-200'>検索バー</div>
        </div>
      </div>
    </div>
  )
}
