"use client"
import { UserButton } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function NavBar() {
    return <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex gap-2 justify-center items-center">
            <GraduationCap className="w-5 h-5" />
            <p className="font-bold">studyless</p>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <UserButton />
        </nav>
    </header>
}