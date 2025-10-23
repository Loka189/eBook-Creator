import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../utils/apiPaths'
import { Trash2, Edit2 } from 'lucide-react'

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate()

  const coverImageUrl = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`
    : 'https://via.placeholder.com/150x200?text=No+Cover'

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] transform"
      onClick={() => {
        navigate('/view-book/' + book._id)
      }}
    >
      {/* Cover + Actions */}
      <div className="relative">
        <img
          src={coverImageUrl}
          alt={book.title}
          className="w-full h-48 object-cover rounded-t-2xl"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover'
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/editor/${book._id}`)
            }}
            className="p-1 bg-white/80 hover:bg-white/100 rounded-full shadow-md transition-colors duration-200"
          >
            <Edit2 size={16} className="text-violet-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(book._id)
            }}
            className="p-1 bg-white/80 hover:bg-red-100 rounded-full shadow-md transition-colors duration-200"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col space-y-1">
        {/* Dummy div decoration */}
        <div className="h-1 w-12 bg-violet-200 rounded-full mb-2"></div>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg truncate">{book.title}</h3>
          <p className="text-gray-500 text-sm truncate">{book.author || 'Unknown Author'}</p>
        </div>

        {/* Another small decorative dummy div */}
        <div className="h-1 w-6 bg-purple-200 rounded-full mt-2"></div>
      </div>
    </div>
  )
}

export default BookCard
