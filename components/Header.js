import { SearchIcon, HomeIcon, MenuIcon, XIcon } from "@heroicons/react/solid"
import { PaperAirplaneIcon, PlusCircleIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/outline"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState)
  const [show, setShow] = useState(false)

  return (
    <div className="bg-white sticky top-0 py-2 z-50 shadow-sm border-b">
      <div>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-5">
          {/* Left */}
          <Link href="/">
            <div>
              <img 
                className="object-contain w-24 h-16 cursor-pointer hidden md:block"
                src="https://links.papareact.com/ocw" 
                alt="Logo"
              />
              <img 
                className="object-contain w-10 h-10 cursor-pointer md:hidden flex-shrink-0"
                src="https://links.papareact.com/jjm" 
                alt="Logo"
              />
            </div>
          </Link>

          {/* Middle */}
          <div className="bg-gray-100 hidden md:flex items-center space-x-2 rounded-md p-1 ring-2 ring-gray-200">
            <SearchIcon className="w-5 h-5 text-gray-500" />
            <input className="outline-none bg-transparent" type="text" placeholder="Search" />
          </div>

          {/* Right */}
          <div className="flex justify-end items-center">
            <div className={`justify-end items-center space-x-5 hidden md:flex ${!session?.user && "md:!hidden"}`}>
              <Link href="/">
                <HomeIcon className="navButton" />
              </Link>
              <div className={`navButton relative ${!show && "hidden"} ${session && "md:!flex"}`}>
                <PaperAirplaneIcon className="rotate-45 w-6" /> 
                <div className="absolute -top-2 -right-1 text-xs w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white z-50">
                  3
                </div>
              </div>
              <PlusCircleIcon 
                onClick={() => setOpen(!open)}
                className="navButton" 
              />
              <UserGroupIcon className="navButton" />
              <HeartIcon className="navButton" />
            </div>
            
            
            {session ? (
              <>
                {show ? (
                  <XIcon 
                      onClick={() => setShow(!show)}
                      className="navButton inline-flex md:hidden ml-5"
                  />
                ) : (
                  <MenuIcon 
                    onClick={() => setShow(!show)}
                    className="navButton inline-flex md:hidden ml-5"
                  />
                )}
                <img  
                  className="h-10 w-10 object-cover rounded-full cursor-pointer ml-5"
                  src={session?.user?.image}
                  alt=""
                  onClick={signOut}
                />
              </>
            ) : (
              <button 
                onClick={signIn}
                className="text-blue-500 font-medium hover:animate-pulse ml-3"
              >Sign In</button>
            )}
          </div>
        </div>
      </div>
      
      <motion.div
        className="w-full overflow-hidden md:hidden"
        animate={show ? { height: "auto" } : { height: 0 }}
      >  
        <div className="flex flex-col items-center space-y-4 py-5">
          <Link href="/">
            <div className="flex items-center space-x-2 navButton">
              <HomeIcon className="w-5 h-5" />
              <p>Home</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2 navButton">
            <div className={`relative ${!show && "hidden"} ${session && "md:!flex"}`}>
              <PaperAirplaneIcon className="rotate-45 w-6" /> 
              <div className="absolute -top-2 -right-1 text-xs w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white z-50">
                3
              </div>
            </div>
            <p>DMs</p>
          </div>

          <div className="flex items-center space-x-2 navButton">
            <PlusCircleIcon 
              onClick={() => setOpen(!open)}
              className="w-5 h-5" 
            />
            <p>Add Post</p>
          </div>

          <div className="flex items-center space-x-2 navButton">
            <UserGroupIcon className="w-5 h-5" />
            <p>Followers</p>
          </div>

          <div className="flex items-center space-x-2 navButton">
            <HeartIcon className="w-5 h-5" />
            <p>Liked Posts</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
