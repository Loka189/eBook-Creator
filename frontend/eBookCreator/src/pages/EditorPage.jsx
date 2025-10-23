import React from 'react'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Sparkles, FileDown, Save, Menu, X, Edit, Notebook, ChevronDown, FileText } from 'lucide-react'
import { API_PATHS } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'
import Dropdown, { DropdownItem } from '../components/ui/Dropdown'
import InputField from '../components/ui/InputField'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import SelectField from '../components/ui/SelectField'
import { use } from 'react'


import ChapterSidebar from '../components/editor/ChapterSidebar'
import { arrayMove } from '@dnd-kit/sortable'




const EditorPage = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('editor') // 'editor' or 'preview'
  const fileInputRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // AI modal states
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiStyle, setAiStyle] = useState('Informative')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOKS_BY_ID}/${bookId}`)
        setBook(response.data)
      } catch (error) {
        toast.error('Error fetching book')
        console.error('Error fetching book:', error)
        navigate('/dashboard')
      } finally {
        setIsLoading(false)
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }))
  }

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    const updatedChapters = [...book.chapters];
    updatedChapters[selectedChapterIndex][name] = value;
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
   };

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${book.chapters.length + 1}`,
      content: ''
  };
    const updatedChapters = [...book.chapters, newChapter];
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if(book.chapters.length <= 1) {
      toast.error('Cannot delete the last chapter');
      return;
    }
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
    setSelectedChapterIndex((prevIndex) => (prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex));
  };

  const handleReorderChapters = (fromIndex, toIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, fromIndex, toIndex)
    }));
    setSelectedChapterIndex(toIndex);
  };

  const handleSaveChanges = async () => {bookToSave=book, showToast=true 
    setIsSaving(true);
    try {
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, bookToSave);
      if (showToast) {
        toast.success('Changes saved successfully');
      }
    } catch (error) {
      toast.error('Error saving changes');
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => { 
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('coverImage', file);
    setIsUploading(true);
    try {
      const response = await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setBook(response.data);
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading cover image');
      console.error('Error uploading cover image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateOutline = async () => { };

  const handleGenerateChapterContent = async (index) => { 
    const chapter = book.chapters[index];
    if(!chapter || !chapter.title) {
      toast.error('Chapter title is required for content generation');
      return;
    }
    setIsGenerating(index);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_CHAPTER_CONTENT, {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || '',
        style: aiStyle
      });
      const updatedChapters = [...book.chapters];
      updatedChapters[index].content = response.data.content;
      setBook(async (prevBook) => {
        const updatedChapters = [...prevBook.chapters];
        updatedChapters[index].content = response.data.content;

        const updatedBook = { ...prevBook, chapters: updatedChapters };
        setBook(updatedBook);
        toast.success('Chapter content generated successfully');

        await handleSaveChanges({ bookToSave: updatedBook, showToast: false });
        return updatedBook;
      });
    } catch (error) {
      toast.error('Error generating chapter content');
      console.error('Error generating chapter content:', error);
    }
  };

  const handleExportPDF = async () => { 
    toast.loading('Preparing PDF export...');
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPORT.PDF}/${bookId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('PDF export successful');
    } catch (error) {
      toast.error('Error exporting PDF');
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportDOCX = async () => {
    toast.loading('Preparing DOCX export...');
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPORT.DOC}/${bookId}/docx`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('DOCX export successful');
    } catch (error) {
      toast.error('Error exporting DOCX');
      console.error('Error exporting DOCX:', error);
    }
  };

  if (isLoading && !book) {
    return (
      <div>
        <p>
          Loading Editor...
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='flex bg-slate-50 font-sans relative min-h-screen'>
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className='fixed inset-0 z-50 flex md:hidden' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-black/20 bg-opacity-75'
              aria-hidden='true' onClick={() => { setIsSidebarOpen(false) }}>

            </div>
            <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white'>
              <div className='absolute top-0 right-0 -mr-12 pt-2'>
                <button className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset'
                  type='button'
                  onClick={() => { setIsSidebarOpen(false) }}
                ><span className='sr-only '>
                    Close sidebar
                  </span>
                  <X className='h-6 w-6 text-white' />

                </button>
              </div>
              <ChapterSidebar
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index)
                  setIsSidebarOpen(false)
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onReorderChapters={handleReorderChapters}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isGenerating}
              />
            </div>
            <div className='flex-shrink-0 w-14' aria-haspopup='true'></div>
          </div>
        )}

        {/* Desktop Sidebar */}
        {/* Desktop Sidebar */}
        <div className='hidden md:flex md:flex-shrink-0'>
          <ChapterSidebar
            book={book}
            selectedChapterIndex={selectedChapterIndex}
            onSelectChapter={(index) => {
              setSelectedChapterIndex(index);
              setIsSidebarOpen(false);
            }}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onReorderChapters={handleReorderChapters}
            onGenerateChapterContent={handleGenerateChapterContent}
            isGenerating={isGenerating}
          />
        </div>
        <main className='flex-1 p-6 bg-gray-50 min-h-screen'>
          <header className='flex flex-col md:flex-row md:justify-between md:items-center mb-6'>
            <div className='flex items-center space-x-4 mb-4 md:mb-0'>
              <button
                onClick={() => { setIsSidebarOpen(true) }}
                className='p-2 rounded-md hover:bg-gray-200 transition-colors duration-200'>
                <Menu className='w-5 h-5 text-gray-700' />
              </button>
              <div className='flex space-x-2'>
                <button className='flex items-center justify-center flex-1 py-2 px-4 text-sm font-medium rounded-md bg-white hover:bg-gray-100 transition-colors duration-200'
                  onClick={() => { setActiveTab('editor') }}>
                  <Edit className='w-4 h-4 mr-2 text-gray-700' />
                  Editor
                </button>
                <button className='flex items-center justify-center flex-1 py-2 px-4 text-sm font-medium rounded-md bg-white hover:bg-gray-100 transition-colors duration-200'
                  onClick={() => { setActiveTab('details') }}>
                  <Notebook className='w-4 h-4 mr-2 text-gray-700' />
                  Book Details
                </button>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Dropdown
                trigger={
                  <Button variant='secondary' icon={FileDown} className='flex items-center space-x-2'>
                    Export
                    <ChevronDown className='w-4 h-4' />
                  </Button>
                }
              >
                <DropdownItem onClick={handleExportPDF} >
                  <FileText className='w-4 h-4 mr-2' />
                  Export as PDF
                </DropdownItem>
                <DropdownItem onClick={handleExportDOCX} >
                  <FileText className='w-4 h-4 mr-2' />
                  Export as DOCX
                </DropdownItem>
              </Dropdown>

              <Button
                onClick={handleSaveChanges}
                isLoading={isSaving}
                icon={Save}
                className='ml-2'
              >
                Save Changes
              </Button>

            </div>
          </header>

          <div>
            {activeTab === 'editor' ?
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onChapterChange={handleChapterChange}
            /> :
            <BookDetailsTab 
              book={book}
              onBookChange={handleBookChange}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />}

          </div>
        </main>

      </div>
    </>
  )
}

export default EditorPage
