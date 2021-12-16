import { CameraIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Modal() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const addImage = (e) => {
    const reader = new FileReader();
    if(e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true)
    // Create post and add to firestore post
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: caption,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    setLoading(true)
    setOpen(false)
    setSelectedFile(null)
  }

  return (
    <div className="top-0 left-0 fixed bg-black z-50 bg-opacity-50 h-screen w-full">
      <div className="grid place-items-center h-screen">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-5 shadow-xl rounded-xl max-w-sm w-full flex flex-col items-center relative"
        >
          <XIcon 
            onClick={() => !loading && setOpen(!open)}
            className="top-4 right-3 absolute w-7 h-7 text-gray-400 cursor-pointer" 
          />
          {selectedFile ? (
            <>
              <img
                className="mx-auto object-cover w-[70%] max-w-sm max-h-36 border"
                src={selectedFile}
                alt=""
              />
              <button
                onClick={() => setSelectedFile()} 
                className="text-blue-400"
              >Remove</button>
            </>
          ) : (
            <CameraIcon 
              onClick={() => filePickerRef.current.click()}
              className="bg-red-100 text-red-600 p-3 mt-5 rounded-full w-14 h-14 cursor-pointer hover:brightness-105 mb-5"
            />
          )}


          <input 
            ref={filePickerRef}
            type="file"
            hidden
            onChange={addImage}
            accept="image/png, image/jpeg"
          />

          <h3 className="text-xl font-semibold mb-5">Upload a photo</h3>
          
          <textarea 
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Please send a caption..." 
            className="resize-none outline-none max-w-xs w-full h-auto mb-5"
          ></textarea>
          
          <button 
            onClick={uploadPost}
            disabled={!caption || !selectedFile}
            className="w-full p-2 disabled:bg-gray-300 disabled:hover:bg-gray-300 bg-red-500 hover:bg-red-400 text-white font-medium rounded-lg"
          >
            {loading ? "Uploading..." : "Upload Post"}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
