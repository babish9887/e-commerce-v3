"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { deleteObject, getDownloadURL, ref } from "firebase/storage"
import { storage } from "@/db/config"
import axios from "axios"

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string
  isAvailableForPurchase: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase)
          router.refresh()
        })
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({
      filePath,
      disabled,
      id,
      imagePath,
    }: {
      filePath: string
      imagePath: string
      id:string
      disabled: boolean
    }) {
      const [isPending, startTransition] = useTransition();
      const router=useRouter()
      const handleOnClick = async () => {
        startTransition(async function () {

              const res = await axios.post("/api/deleteProduct", { id })
              if (!res.data.success)
                     toast.error("Error Deleting Product")
              try {
                    const fileRef = ref(storage, filePath)
                    const imageRef = ref(storage, imagePath)
                    await deleteObject(fileRef)
                    await deleteObject(imageRef)
                    router.refresh()

              } catch (error) {
                    toast.error("Error Deleting Product")
              }
        });
      };
    

      
      return (
        <DropdownMenuItem
          className="text-red-500 hover:text-white hover:bg-red-500"
          disabled={disabled || isPending}
          onClick={handleOnClick}
        >
          Delete
        </DropdownMenuItem>
      );
    }

export function DownloadDropDownItem({filePath, name}:any){
      
      const handleOnClick=async ()=>{
            const imageRef=ref(storage,filePath)
            const url=await getDownloadURL(imageRef)     
            try {
                  const respnse=await fetch(url)
                  const blob=await respnse.blob()
                  const blobUrl=URL.createObjectURL(blob)
            
                  const link=document.createElement('a')
                  link.href=blobUrl
                  link.download=`${name}.${filePath?.split('.')[1]}` || "DigitalOasisProduct"
                  link.click()
                  URL.revokeObjectURL(blobUrl)
                } catch (error) {
                  toast.error("Something went wrong")
                } 
      }

      return (
            <DropdownMenuItem onClick={handleOnClick}>
                  Download
            </DropdownMenuItem>
      )
}