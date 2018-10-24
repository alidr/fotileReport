import { storeLocal, storeSession } from './browserStore'
import initRoutes from './initRoutes'

const state = {
  AccessId: storeLocal.get('AccessId') || '',
  DealerSelectedMember: storeSession.get('DealerSelectedMember') || [],
  BusninessCompanyInfo: storeSession.get('BusninessCompanyInfo') || []
}



export default state
