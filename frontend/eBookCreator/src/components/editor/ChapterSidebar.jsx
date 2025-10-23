import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '../ui/Button'
import toast from 'react-hot-toast'


// Sortable Chapter Item Component
const SortableItem = ({ chapter, index, selectedChapterIndex, onSelectChapter, onDeleteChapter, onGenerateChapterContent, isGenerating }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter._id || `new-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-2 border border-gray-200 rounded-md bg-white shadow-sm flex items-center justify-between ${
                selectedChapterIndex === index ? 'ring-2 ring-indigo-500' : ''
            }`}
        >
            <div className='flex items-center space-x-2'>
                <GripVertical className='w-4 h-4 text-gray-400' />
                <span className='text-sm font-medium text-gray-900'>{chapter.title}</span>
            </div>
            <div className='flex items-center space-x-2'>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onGenerateChapterContent(chapter)}
                    disabled={isGenerating}
                >
                    <Sparkles className='w-4 h-4 mr-1' />
                    Generate
                </Button>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onDeleteChapter(chapter)}
                >
                    <Trash2 className='w-4 h-4 mr-1' />
                    Delete
                </Button>
            </div>
        </div>
    );
};





const ChapterSidebar = ({
    book,
    selectedChapterIndex,
    onSelectChapter,
    onAddChapter,
    onDeleteChapter,
    onReorderChapters,
    onGenerateChapterContent,
    isGenerating
}) => {
    const navigate = useNavigate();

    const chapterIds = book.chapters.map((chapter, index) => chapter._id || `new-${index}`);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = chapterIds.indexOf(active.id);
            const newIndex = chapterIds.indexOf(over.id);
            onReorderChapters(oldIndex, newIndex);
        }
    };
    return (
        <aside className='w-72 bg-white border-r border-gray-200 flex flex-col'>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => { navigate('/dashboard') }}
                    className='flex items-center text-gray-700 hover:text-gray-900'
                >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Dashboard
                </Button>
                <h2
                    className='text-lg font-semibold text-gray-900 truncate max-w-[10rem]'
                    title={book.title}
                >
                    {book.title}
                </h2>
            </div>

            <div className='flex-1 overflow-y-auto bg-gray-50'>
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chapterIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='p-4 space-y-2'>
                            {book.chapters.map((chapter, index) => (
                                <SortableItem
                                    key={chapter._id || `new-${index}`}
                                    chapter={chapter}
                                    index={index}
                                    selectedChapterIndex={selectedChapterIndex}
                                    onSelectChapter={onSelectChapter}
                                    onDeleteChapter={onDeleteChapter}
                                    onGenerateChapterContent={onGenerateChapterContent}
                                    isGenerating={isGenerating}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className='p-4 border-t border-slate-200 bg-white'>
                <Button
                    className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl'
                    variant='secondary'
                    onClick={onAddChapter}
                    icon={Plus}
                >
                    New Chapter
                </Button>
            </div>
        </aside>

    )
}

export default ChapterSidebar
