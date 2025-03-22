import React from 'react'
import { Loader } from 'lucide-react'

const loding = () => {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <Loader className='animate-spin size-8'/>
    </div>
  )
}

export default loding
