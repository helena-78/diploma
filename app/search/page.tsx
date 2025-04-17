"use client";

import { useState } from "react";  
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button"
import { SignUpButton } from "@/components/sign-up-button"
import { Search } from "lucide-react"


export default function Home() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
          src="/logo.svg" 
          alt="Logo" 
          width={32} 
          height={32} 
          className="w-8 h-8"
        />
          <span className="font-semibold text-lg">Pet Adoption Network</span>
        </Link>


        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
            src="/saved.svg" 
            alt="Saved" 
            width={16} 
            height={16} 
            className="w-5 h-5"
          />
          </Link>
          <SignInButton />
          <SignUpButton />

          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row bg-[url('/paw.svg')] bg-cover bg-center">
      
      </main>
  
      <footer className="bg-[#1a2c3d] text-white py-8 px-12">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
              <li>Cancellation Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>+(02)12-345-67-89</li>
              <li>+(02)12-345-67-89</li>
              <li>info-pan@gmail.com</li>
              <li className="flex gap-4 pt-2">
                <Facebook className="w-5 h-5" />
                <Instagram className="w-5 h-5" />
                <Youtube className="w-5 h-5" />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
