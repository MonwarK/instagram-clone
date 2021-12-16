import { useSession } from "next-auth/react";
import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";

export default function Feed() {
  const { data: session } = useSession()

  return (
    <main className={`grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 mx-auto px-5 ${session && "grid xl:!max-w-6xl"}`}>
      <section className="col-span-2">
        {/* Stories */}
        <Stories />
        {/* Post */}
        <Posts />
      </section>

      {session && (
        <section className="hidden xl:inline-grid">
          <div className="fixed top-20">
            <MiniProfile />
            <Suggestions />
          </div>
        </section>
      )}

    </main>
  )
}
