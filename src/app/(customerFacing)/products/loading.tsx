import { Loader2 } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Loader2 size={68} className='animate-spin'/>
    </div>
  )
}

export default loading