import Moment from "react-moment";

export default function Comment({ username, timestamp, comment }) {
  return (
    <div className="flex items-center justify-between mb-2 text-md">
      <span className="font-medium">{username}</span> 
      <p className="flex-1 ml-2">{comment}</p>
      <Moment className="text-gray-400 text-xs" fromNow>{timestamp?.toDate()}</Moment>
    </div>
  )
}
