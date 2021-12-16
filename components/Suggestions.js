import faker from "faker"
import { useEffect, useState } from "react"

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
      avatar: `https://picsum.photos/${Math.floor(Math.random() * 200)}`
    }));

    setSuggestions(suggestions);
  }, [])

  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold">Suggestions for you</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>
      {suggestions.map((profile) => (
        <div key={profile.id} className="flex items-center justify-between mt-3">
          <img className="w-10 h-10 rounded-full border p-[2px]" src={profile.avatar} alt="" />
        
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-xs">{profile.username.toLowerCase()}</h2>
            <h3 className="text-xs text-gray-400 truncate">Works at {profile.company.name}</h3>
          </div>

          <button className="text-blue-500">Follow</button>
        </div>
      ))}
    </div>
  )
}
