import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Book } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import DashboardLayout from '../components/layouts/DashboardLayout'
import BookCard from '../components/cards/BookCard'
import CreateBookModal from '../components/modal/CreateBookModal'


// Skeleton Loader for Book Card
const BookCardSkeletonLoader = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [books, setBooks] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [bookToDelete, setBookToDelete] = React.useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleCreateBook = async () => {
    setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  };

  return (
    <DashboardLayout>
  <div className="p-6 space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All eBooks</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Manage your eBooks here. Create, edit, and organize your content
        </p>
      </div>

      {/* Create Button */}
      <Button
        onClick={handleCreateBook}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transform transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Create New eBook</span>
      </Button>
    </div>

    {/* Books List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <p className="text-gray-500 col-span-full text-center">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center">
          No books yet. Start by creating one!
        </p>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex items-center space-x-4 cursor-pointer hover:scale-[1.02] transform"
            onClick={() => navigate(`/editor/${book.id}`)}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-lg font-bold shadow-md">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{book.title}</h3>
              <p className="text-gray-500 text-sm truncate">
                {book.description || 'No description'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Skeleton Loader */}
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <BookCardSkeletonLoader key={index} />
        ))}
      </div>
    ) : books.length === 0 ? (
      <div className="text-center mt-6 space-y-4">
        <div>
          <Book className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          No eBooks found.
        </h3>
        <p className="text-gray-500">
          You haven't created any eBooks yet. Click the "Create New eBook" button to get started!
        </p>
        <Button
          onClick={handleCreateBook}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transform transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create New eBook</span>
        </Button>
      </div>
    ) : (
      <div>
        {/* Dummy div placeholder left untouched for future BookCard additions */}
        {books.map((book) => (
          <BookCard key={book._id} book={book} onDelete={() => setBookToDelete(book._id)} />
        ))}
      </div>
    )}

    {/* Create Book Modal */}
    <CreateBookModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onBookCreated={handleBookCreated}
    />
  </div>
</DashboardLayout>


  )
}

export default DashboardPage
