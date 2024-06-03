"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/Formatter'
import React, { useState } from 'react'
import { addProduct, updateProduct } from '../../_actions/products'
import { useFormState, useFormStatus } from 'react-dom'
import { Product } from '@prisma/client'
import Image from 'next/image'
import Category from '../../../../../Categories.json'
import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select"

function ProductForm({ product }: { product?: Product | null }) {
    const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
    const [price, setPrice] = useState<number | undefined>(product?.price)
    const url=`https://firebasestorage.googleapis.com/v0/b/digital-oasis-35451.appspot.com/o/Images%2F${product?.imagePath.split('/')[1]}?alt=media&token=${process.env.URL_TOKEN}`

      Category.shift()
      Category.unshift("None")
    return (
        <form className='space-y-8' action={action}>
            <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input type='text' id='name' name='name' required defaultValue={product?.name || ""} />
                {error?.name && <div className='text-destructive'>{error?.name}</div>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input type='number' id='price' name='price' required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value) || undefined)} />
                {error?.price && <div className='text-destructive'>{error?.price}</div>}
            </div>

            <div className='text-muted-foreground'>
                {formatCurrency(price || 0)}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea id='description' name='description' required defaultValue={product?.description} />
                {error?.description && <div className='text-destructive'>{error?.description}</div>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                  <Select name='category' >
                        <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup >
                        {Category.map((category)=>(
                              <SelectItem value={category}>{category}</SelectItem>
                        ))}
                        </SelectGroup>
                        </SelectContent>
                  </Select>
                {error?.category && <div className='text-destructive'>{error?.category}</div>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='file'>File</Label>
                <Input type='file' id='file' name='file' required={product == null} />
                {product != null && <div className='text-muted-foreground'>{product?.filePath}</div>}
                {error?.file && <div className='text-destructive'>{error?.file}</div>}
            </div>

            <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product == null} />
            {product != null && (
            <Image
                  src={url}
                  height="400"
                  width="400"
                  alt="Product Image"
            />
            )}
            {error?.image && <div className="text-destructive">{error?.image}</div>}
            </div>

    

            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type='submit' disabled={pending}>
            {pending ? "Saving..." : "Save"}
        </Button>
    )
}

export default ProductForm
