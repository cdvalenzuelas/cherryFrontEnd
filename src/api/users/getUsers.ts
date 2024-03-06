import type { User, SaleFromDb, UserFromDB, Sale } from '@state'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { populate, createDateFromString } from '..'
import { updateActivePlanStatus } from '../sales/updateActivePlanStatus'

const supabase = createClientComponentClient()

// Obtener los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from('users')
      .select('id, name, image, role, active_plan, instagram_id, mail, phone, referral_code, reward')

    // Si no viene data o hay un error lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    // Vamos atransformar la data
    const users: UserFromDB[] = data as UserFromDB[]

    // Obtenermos los id de los paquetes activos, solo vamos a publar ids válidos
    const activePlansId = users.map(user => user.active_plan).filter(id => id !== null) as string[]

    // Vamos a traer los planes activos
    let minimalActivePlans: SaleFromDb[] = []

    // Si todos los usuario tienen planes creados en algún momento
    if (activePlansId.length > 0) {
      minimalActivePlans = await populate<SaleFromDb[]>({
        table: 'sales',
        select: '*',
        ids: activePlansId
      })
    }

    const newUsers: User[] = []
    const expiredPacks: string[] = []

    const currentDate = new Date()
    const currentDate2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    // Vamos a rellenar los active_plan status
    users.forEach(({ id, image, active_plan: internalActivePlan, role, name, instagram_id: instagramId, mail, phone, referral_code: referralCode, reward }) => {
      let activePlan: Sale | null = null

      if (internalActivePlan !== null) {
        const activePlan1 = minimalActivePlans.filter(item => item.id === internalActivePlan)[0]

        const endDate = createDateFromString(activePlan1.end_date)

        // Verify activePalnStatus
        const classesWasCompleted = activePlan1.classes !== -1 && (activePlan1.classes === activePlan1.taken_classes)
        const dateWasReached = endDate < currentDate2

        if ((classesWasCompleted || dateWasReached) && activePlan1.active) {
          expiredPacks.push(activePlan1.id as string)
        }

        activePlan = {
          ...activePlan1,
          sale_date: createDateFromString(activePlan1.sale_date),
          start_date: createDateFromString(activePlan1.start_date),
          end_date: endDate,
          active: !(classesWasCompleted || dateWasReached)
        }
      }

      newUsers.push({
        id,
        auth_id: id,
        image,
        role,
        name,
        instagram_id: instagramId,
        active_plan: activePlan,
        mail,
        phone,
        referral_code: referralCode,
        reward
      })
    })

    updateActivePlanStatus(expiredPacks)

    return newUsers
  } catch (error) {
    return []
  }
}
