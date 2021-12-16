import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { HeartIcon, ChatIcon, PaperAirplaneIcon, BookmarkIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { postState } from "../atom/postAtom";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([])
  const [post, setPost] = useRecoilState(postState)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => (
        setLikes(snapshot.docs)
      )
    )
  }, [db, id])

  useEffect(() => {
    const filter = likes.filter(like => like.id === session?.user?.uid);

    setHasLiked(
      filter.length > 0
    )
    console.log()
  }, [likes])

  
  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(db, "posts", id, "likes", session.user.uid)
      )
    } else {
      await setDoc(
        doc(db, "posts", id, "likes", session.user.uid), {
          username: session?.user?.username
        }
      )
    }
  }

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* Header */}
      <div className="flex items-center p-5">
        <img className="rounded-full h-12 w-12 object-cover border p-1 mr-3" src={userImg} alt="" />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon class="h-5"/>
      </div>
      {/* Img */}
      <img className="w-full h-96 object-cover" src={img} alt="" />
      {/* Buttons */}
      {session && (
        <div className="px-4 pt-2">
          {likes.length > 0 && <p className="text-gray-800 font-bold">{likes.length} like{likes.length > 1 && "s"}</p>}
          <div className="flex justify-between">
            <div className="flex space-x-4 pt-2">
              {hasLiked ? (
                <HeartSolidIcon onClick={likePost} className="btn text-red-500" />
              ) : (
                <HeartIcon onClick={likePost} className="btn" />
              )}
              <ChatIcon className="btn" onClick={() => setPost({ id, username, userImg, img, caption })} />
              <PaperAirplaneIcon className="btn rotate-45" />
            </div>
            <BookmarkIcon className="btn" />
          </div>
        </div>
      )}

      {/* Caption */}
      <p className="px-5 pt-5 pb-7 truncate">
        <span className="font-bold mr-1">{username}</span>
        {caption}
      </p>
    </div>
  )
}
