"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <Link href="/dashboard" className="font-bold text-xl" onClick={() => setOpen(false)}>
            BiasAnalyzer
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-4 py-4">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/uploads", label: "Uploads" },
            { href: "/dashboard/reports", label: "Reports" },
            { href: "/dashboard/settings", label: "Settings" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="text-lg font-medium" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t pt-4">
          <Link
            href="/logout"
            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => setOpen(false)}
          >
            Logout
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
