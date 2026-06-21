import { Loader2, Plus, Save } from 'lucide-react'
import React from 'react'

const Button = ({ click, isLoading, isEditing }) => {
  return (
    <button disabled={isLoading} onClick={click} className={`${isLoading ? "bg-blue-600/40 cursor-not-allowed" : "bg-blue-600 cursor-pointer hover:bg-blue-700"}  rounded-lg text-white text-sm p-4 w-[250px]  duration-500  `}>

        {isLoading ? <Loader2 className='animate-spin flex items-center justify-center w-full'/> :  (
          <div >
          {isEditing ? (
            <div className='flex items-cneter justify-center gap-1'>
              <Save size={20}/>
              <h1>Update Transaction</h1>
            </div>

          ) : (
            <div className='flex items-cneter justify-center gap-1'>
              <Plus size={20}/>
              <h1>Add Transaction</h1>
            </div>
          )}
          </div>
        ) }
    </button>
  )
}

export default Button