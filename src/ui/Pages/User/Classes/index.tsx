// Componets
import { H3 } from '@/ui/Global/Titles/H3'
import { Calendar } from './Calendar'
import { TeacherSummary } from './TeacherSummary'
import { SearchUser } from '@/ui/Global/SearchUser'
import { useUserState } from '@/state'
import { useState } from 'react'

export const Classes = () => {
  const userRole = useUserState(state => state.role)
  const [userId, setUserId] = useState<string | null>(null)

  const getUserId = (userId: string | null) => {
    setUserId(userId)
  }

  return (<section className='flex flex-col gap-5 rounded mx-auto w-4/5 px-5 py-5 bg-white'>

    <div className='flex justify-between items-center gap-2'>
      <H3>MIS CLASES</H3>
      {(userRole === 'admin' || userRole === 'superAdmin') && <SearchUser getUserId={getUserId} showAllUsers={true} />}
    </div>

    <Calendar userId={userId} />
    <TeacherSummary />

  </section>)
}
