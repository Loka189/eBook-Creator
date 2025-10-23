import React, { useState, useRef, useEffect } from 'react'
import { Plus, Sparkles, Trash, Hash, Palette, Lightbulb, BookOpen, ArrowLeft } from 'lucide-react'
import Modal from '../ui/Modal'
import InputField from '../ui/InputField'
import SelectField from '../ui/SelectField'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
//import { on } from '../../../../../backend/models/User'

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [bookTitle, setBookTitle] = useState('')
    const [numberOfChapters, setNumberOfChapters] = useState(5)
    const [aiTopic, setAiTopic] = useState('')
    const [aiStyle, setAiStyle] = useState('Narrative')
    const [chapters, setChapters] = useState([])
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
    const [isFinalizingBook, setIsFinalizingBook] = useState(false)
    const chaptersContainerRef = useRef(null)

    const resetModal = () => {
        setStep(1)
        setBookTitle('')
        setNumberOfChapters(5)
        setAiTopic('')
        setAiStyle('Narrative')
        setChapters([])
        setIsGeneratingOutline(false)
        setIsFinalizingBook(false)
    }

    const handleGenerateOutline = async () => { 
        if (!bookTitle || !numberOfChapters){
            toast.error('Please provide book title and number of chapters')
            return;
        }
        setIsGeneratingOutline(true)
        try {
            const response= await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE,{
                topic:bookTitle,
                description: aiTopic || '',
                style: aiStyle,
                numChapters: numberOfChapters
            })
            setChapters(response.data.chapters)
            setStep(2)
            toast.success('Outline generated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate outline')
        } finally {
            setIsGeneratingOutline(false)
        }
    }
    const handleChapterChange = (index, field, value) => {
        const updatedChapters = [...chapters]
        updatedChapters[index] = { ...updatedChapters[index], [field]: value }
        setChapters(updatedChapters)
    }

    const handleDeleteChapter = (index) => {
        if (chapters.length <= 1) {
            toast.error('At least one chapter is required')
            return
        }
        setChapters(chapters.filter((_, i) => i !== index))
    }

    const handleAddChapter = () => {
        setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, description: '' }])
    }

    const handleFinalizeBook = async () => {
        if (!bookTitle || chapters.length === 0) {
            toast.error('Book title and chapters are required')
            return
        }
        setIsFinalizingBook(true)
        try {
            const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
                title: bookTitle,
                author: user.name || 'Unknown Author',
                chapters: chapters,
            })
            toast.success('eBook created successfully')
            onBookCreated(response.data._id)
            onClose()
            resetModal()
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to create eBook')
        } finally {
            setIsFinalizingBook(false)
        }
     }

    useEffect(() => {
        if (step === 2 && chaptersContainerRef.current) {
            const scrollableDiv = chaptersContainerRef.current
            scrollableDiv.scrollTo({
                top: scrollableDiv.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [chapters.length, step])

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                resetModal()
                onClose()
            }}
            title="Create New eBook"
        >
            {step === 1 && (
                <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">
                                1
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Details</p>
                        </div>
                        <div className="w-10 h-[2px] bg-violet-300"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold shadow-inner">
                                2
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Outline</p>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <InputField
                            icon={BookOpen}
                            label="Book Title"
                            placeholder="Enter your eBook title"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                        />
                        <InputField
                            icon={Hash}
                            label="Number of Chapters"
                            type="number"
                            min={1}
                            max={20}
                            placeholder="Enter number of chapters"
                            value={numberOfChapters}
                            onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 1)}
                        />
                        <InputField
                            icon={Lightbulb}
                            label="AI Topic"
                            placeholder="Enter the main topic for AI to generate content"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                        />
                        <SelectField
                            icon={Palette}
                            label="AI Style"
                            options={['Narrative', 'Descriptive', 'Expository', 'Persuasive', 'Humorous', 'Satirical']}
                            value={aiStyle}
                            onChange={(e) => setAiStyle(e.target.value)}
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="pt-4 text-center">
                        <Button
                            onClick={handleGenerateOutline}
                            isLoading={isGeneratingOutline}
                            icon={Sparkles}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all duration-200"
                        >
                            Generate Outline with AI
                        </Button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">1</div>
                            <p className="text-xs text-gray-600 mt-1">Details</p>
                        </div>
                        <div className="w-10 h-[2px] bg-violet-300"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">2</div>
                            <p className="text-xs text-gray-600 mt-1">Outline</p>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Review Chapters</h3>
                            <span className="text-sm text-gray-500">{chapters.length} chapters</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={() => setStep(1)}
                                className="w-full max-w-[120px] bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                                variant="ghost"
                                icon={ArrowLeft}
                            >
                                Back
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleFinalizeBook}
                                isLoading={isFinalizingBook}
                                className="ml-2"
                            >
                                Create eBook
                            </Button>
                        </div>
                    </div>

                    {/* Chapters list (scrollable) */}
                    <div
                        ref={chaptersContainerRef}
                        className="space-y-4 max-h-64 overflow-auto pr-2"
                    >
                        {chapters.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                                <p className="mt-3 text-gray-500">No chapters generated yet. Add chapters to proceed.</p>
                            </div>
                        ) : (
                            chapters.map((chapter, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center font-semibold">
                                                {index + 1}
                                            </div>
                                            <input
                                                type="text"
                                                value={chapter.title}
                                                onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                                                placeholder="Chapter title"
                                                className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => handleDeleteChapter(index)}
                                            title="Delete Chapter"
                                            className="ml-4 p-2 rounded-md hover:bg-red-50 transition-colors"
                                        >
                                            <Trash className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>

                                    <textarea
                                        value={chapter.description}
                                        onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                                        placeholder="Chapter description"
                                        rows={3}
                                        className="mt-3 w-full resize-none rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-violet-300 focus:ring-1 focus:ring-violet-100"
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add chapter button */}
                    <div className="pt-2">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddChapter}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-150"
                            >
                                <Plus className="w-4 h-4 text-violet-600" />
                                <span className="text-sm font-medium text-gray-700">Add Chapter</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Modal>
    )
}

export default CreateBookModal
