import { EmojiHappyIcon, XIcon } from "@heroicons/react/outline"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "@firebase/firestore";
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { postState } from "../atom/postAtom"
import { db } from "../firebase"
import Comment from "./Comment";

export default function PostPopup() {
  const { data: session } = useSession();
  const [post, setPost] = useRecoilState(postState);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if(post.id){
      onSnapshot(
        query(
          collection(db, "posts", post.id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      )
    }
  }, [db, post]);

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('')

    await addDoc(collection(db, "posts", post.id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  }

  return (
    <div className="top-0 left-0 fixed bg-black z-50 bg-opacity-50 h-screen w-full">
      <div className="grid place-items-center h-screen">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white shadow-xl md:rounded-xl max-w-6xl w-full relative md:grid grid-cols-2"
        >
          <XIcon 
            onClick={() => setPost(!post)}
            className="w-7 h-7 text-gray-400 cursor-pointer absolute top-5 right-5" 
          />
          <div className="bg-black md:rounded-l-xl">
            <img
              className="h-96 md:h-[600px] w-full object-contain"
              src={post.img}
            /> 
          </div>
          <div className="p-5 flex flex-col">
            <div className="flex items-center">
              <img
                className="rounded-full w-12 h-12 object-cover"
                src={post.userImg}
                alt=""
              />
              <p className="ml-5 font-medium">{post.username}</p>
            </div>

            <hr className="my-5" />

            <div>
              <p><span className="font-medium md:text-lg">{post.username}</span> {post.caption}</p>
            </div>

            <hr className="my-5" />

            <div className="md:flex-1 h-[20vh] md:h-auto">
              {comments.map((comment) => (
                <Comment
                  username={comment.data().username} 
                  timestamp={comment.data().timestamp} 
                  comment={comment.data().comment}
                />
              ))}
            </div>

            <form onSubmit={sendComment} className="flex items-center space-x-2 mt-5">
              <EmojiHappyIcon className="w-6 h-6" />
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border-b-2 w-full py-2 outline-none"
                type="text"
                placeholder="Post a comment..."
              />
              <button className="text-blue-500 font-medium">Post</button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
