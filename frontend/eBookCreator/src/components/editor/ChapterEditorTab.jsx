import React from 'react'
import { useMemo, useState } from 'react'
import { Sparkles, Type, Eye, Maximize2 } from 'lucide-react'

const ChapterEditorTab = ({
    book = {
        title: 'Untitled',
        chapters: [
            {
                title: 'Chapter 1',
                content: '-'
            }
        ]
    },
    selectedChapterIndex = 0,
    onChapterChange = () => { },
    onGenerateChapterContent = () => { },
    isGenerating
}) => {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Simple markdown parser
    const formatMarkdown = (text) => {

    };

    const mdeOptions = useMemo(() => ({
        autofocus: true,
        spellChecker: false,
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'preview', '|', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
        ]
    }), []);

    if (selectedChapterIndex === null || !book.chapters[selectedChapterIndex]) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div className="text-center text-gray-600">
                    <div className="flex justify-center mb-3 text-gray-400">
                        <Type className="w-10 h-10" />
                    </div>
                    <p className="text-lg font-medium">Select a chapter to start editing</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Choose from the sidebar to begin writing
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : 'flex-1 p-6 bg-gray-50'} rounded-lg`}>
           {/* Header */}
           <div>
            <div>
                <div>
                    <div>
                        <h1>
                            Chapter Editor
                        </h1>
                        <p>
                            Editing: {book.chapters[selectedChapterIndex].title || `Chapter ${selectedChapterIndex + 1}`}
                        </p>
                    </div>

                    <div>
                        {/* Editor Controls */}
                        <div>
                            <button
                                onClick={() => setIsPreviewMode(!isPreviewMode)}
                                className={`${isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-md flex items-center space-x-2`}
                            >
                                <Eye className="w-4 h-4" />
                                <span>{isPreviewMode ? 'Edit Mode' : 'Preview Mode'}</span>

                            </button>
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </div>
    )
}

export default ChapterEditorTab
