

import React, { useEffect } from 'react'
import Chat from './Chat'
import Discussion from './Discussion'

interface CoreOverlaysProps {
    showVoidOverlay: boolean
    setShowVoidOverlay: React.Dispatch<React.SetStateAction<boolean>>
    showHumanAGIOverlay: boolean
    setShowHumanAGIOverlay: React.Dispatch<React.SetStateAction<boolean>>
    setIsChatting: React.Dispatch<React.SetStateAction<boolean>>
}

const CoreOverlays = ({ setIsChatting, showVoidOverlay, setShowVoidOverlay, showHumanAGIOverlay, setShowHumanAGIOverlay }: CoreOverlaysProps) => {

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'escape') {
                setShowVoidOverlay(false)
                setShowHumanAGIOverlay(false)
                setIsChatting(false)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    })

    return (
        <>
            {showVoidOverlay && (
                <div className="overflow-y-auto fixed left-[25px] top-5 w-[calc(100%-50px)] bottom-[25px] bg-white/98 text-white font-light text-md box-border flex flex-col">
                    <div className='w-full h-full'>
                        <h1 className='text-2xl flex flex-center text-center justify-center my-3 mt-6 text-black'>Void Manager</h1>
                        <div className='text-lg text-gray-700 flex justify-center '>
                          
                        </div>
                            <Chat 
                                inputPlaceholder='Type message...'
                                bodyPlaceholder='Response appears here...'
                                title='Chat'
                                userTag='void_general'
                            />
                            
                            <Discussion 
                                inputPlaceholder='Type message...'
                                bodyPlaceholder='Response appears here...'
                                title='Executor'
                                userTag='void_general'
                            />
                        </div>
                    </div>
                
            )}
            {showHumanAGIOverlay && (
                <div className="fixed left-[25px] top-5 w-[calc(100%-50px)] bottom-[25px] bg-white/98 text-white font-light text-md box-border flex flex-col">
                    <iframe
                        className='w-full h-full'
                        src='https://human.dilloncarey.com'
                    />
                </div>
            )}

        </>
    )
}

export default CoreOverlays

/*
<div className="fixed left-[25px] top-5 w-[calc(100%-50px)] bottom-[25px] bg-white/98 text-white font-light text-md box-border flex flex-col">
                <iframe
                    className='w-full h-full'
                    src='https://intelligence.dilloncarey.com'
                />
            </div>
*/