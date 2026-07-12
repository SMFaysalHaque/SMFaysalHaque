"use client"

import * as React from "react"
import QRCode from "react-qr-code"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { profile } from "@/data/profile"

type TelegramQrDialogProps = {
  className?: string
  "aria-label"?: string
  children: React.ReactNode
}

export function TelegramQrDialog({
  className,
  "aria-label": ariaLabel,
  children,
}: TelegramQrDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={cn("cursor-pointer", className)} aria-label={ariaLabel}>
        {children}
      </DialogTrigger>
      <DialogContent className="items-center">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle>Chat with me on Telegram</DialogTitle>
          <DialogDescription>
            Scan this QR code with your phone camera or the Telegram app to start
            a conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-white p-4">
          <QRCode
            value={profile.socials.telegram}
            size={200}
            fgColor="#000000"
            bgColor="#ffffff"
            aria-hidden
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
