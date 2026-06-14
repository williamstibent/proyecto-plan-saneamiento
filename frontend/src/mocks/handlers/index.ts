import { authHandlers }       from './auth'
import { dashboardHandlers }   from './dashboard'
import { proceduresHandlers }  from './procedures'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...proceduresHandlers,
]
