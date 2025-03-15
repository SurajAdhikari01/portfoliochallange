"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import Tilt from "./Tilt"

type SocialLinkProps = {
  icon: ReactNode
  platform: string
  username: string
  href: string
  color: string
}

export default function SocialLink({ icon, platform, username, href, color }: SocialLinkProps) {
  return (
    <Tilt scale={1.05} perspective={500}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ boxShadow: `0 10px 25px -5px ${color}30` }}
        className="flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl hover:bg-pink-100 dark:hover:bg-gray-800 transition-all border border-pink-100/50 dark:border-pink-900/20"
      >
        <motion.div
          whileHover={{ y: [0, -5, 0], rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
          className="text-primary mb-2 relative"
          style={{ color }}
        >
          <motion.div
            className="absolute -inset-3 rounded-full z-0"
            style={{ backgroundColor: `${color}20` }}
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
          <div className="relative z-10">{icon}</div>
        </motion.div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{platform}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{username}</p>
      </motion.a>
    </Tilt>
  )
}