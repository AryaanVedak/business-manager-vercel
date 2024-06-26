import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link className="flex items-center" href="/">
            {/* <MountainIcon className="h-6 w-6" /> */}
            <span className="text-2xl font-bold tracking-tight">Omkar Creation</span>
            {/* <div >Omkar</div> */}
          </Link>
          <nav className="hidden md:flex gap-5">
            <Link className="font-medium flex items-center text-sm transition-colors hover:underline" href="/">
              Home
            </Link>
            <Link className="font-medium flex items-center text-sm transition-colors hover:underline" href="/add-invoice">
              Invoice
            </Link>
            <Link className="font-medium flex items-center text-sm transition-colors hover:underline" href="#">
              Services
            </Link>
            <Link className="font-medium flex items-center text-sm transition-colors hover:underline" href="#">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline">
              Sign in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}