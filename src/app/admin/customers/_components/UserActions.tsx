"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products"
import { useRouter } from "next/navigation"
import { deleteUser, toggleUserActivate } from "../../_actions/users"

export function ActiveToggleDropdownItem({
  id,
  isActivate,
}: {
  id: string
  isActivate: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleUserActivate(id, !isActivate)
          router.refresh()
        })
      }}
    >
      {isActivate ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
    className="text-red-500 hover:text-white hover:bg-red-500"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteUser(id)
          router.refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}