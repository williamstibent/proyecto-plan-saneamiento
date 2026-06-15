import { authHandlers }       from './auth'
import { dashboardHandlers }   from './dashboard'
import { proceduresHandlers }  from './procedures'
import { operarioHandlers }    from './operario'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...proceduresHandlers,
  ...operarioHandlers,
]
