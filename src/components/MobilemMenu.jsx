"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NavLink from "./NavLink"

type MobileMenuProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentSection: string
}

export default function MobileMenu({ isOpen, setIsOpen, currentSection }: MobileMenuProps) {
  return (
    <div className="md:hidden mobile-menu-container">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 glassmorphism border-b border-pink-100/30 dark:border-pink-900/30 shadow-lg z-50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavLink href="#about" isActive={currentSection === 'about'}>About</NavLink>
              <NavLink href="#hobbies" isActive={currentSection === 'hobbies'}>Hobbies</NavLink>
              <NavLink href="#contact" isActive={currentSection === 'contact'}>Contact</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}