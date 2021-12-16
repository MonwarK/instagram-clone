import faker from "faker"
import { useEffect, useState } from "react"
import Story from "./Story"
import ScrollContainer from 'react-indiana-drag-scroll'

export default function Stories() {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    setSuggestions([...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
      avatar: `https://picsum.photos/${Math.floor(Math.random() * 200)}`
    })))
  }, [])

  return (
    <ScrollContainer className="flex space-x-4 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll relative">

      {suggestions.map((profile) => (
        <Story 
          key={profile.id} 
          img={profile.avatar}
          profile={profile}
          username={profile.username}
        />
      ))}
    </ScrollContainer>
  )
}
