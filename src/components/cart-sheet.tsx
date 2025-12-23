import { Cart } from '@/types'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ShoppingCart } from 'lucide-react'

interface CartSheetProps {
  cart: Cart | null,
  count: number,
}

export default function CartSheet({cart, count}: CartSheetProps) {
  return (
    <Sheet>
      <SheetTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {"#"}
        </span>
      </SheetTrigger>

      <SheetContent className='p-6'>
        <SheetHeader className='sr-only'>
          <SheetTitle>カート</SheetTitle>
          <SheetDescription>
            カート内の商品を確認・編集できます。購入手続きに進むには「お会計に進む」へ。
          </SheetDescription>
        </SheetHeader>

        {cart ? (
          <div>アイテム</div>
        ) : (
          <div>空</div>
        )}
      </SheetContent>
    </Sheet>
  )
}
