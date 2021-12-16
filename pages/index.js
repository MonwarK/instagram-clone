import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atom/modalAtom'
import { postState } from '../atom/postAtom'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'
import PostPopup from '../components/PostPopup'

export default function Home() {
  const open = useRecoilValue(modalState)
  const post = useRecoilValue(postState)

  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      {/* Header */}
      <Header />

      {/* Feed */}
      <Feed />

      {/* Modal */}
      {open && (
        <Modal />
      )}
      {post && (
        <PostPopup />
      )}
    </div>
  )
}
