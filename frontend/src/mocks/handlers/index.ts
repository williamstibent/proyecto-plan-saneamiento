import { authHandlers }         from './auth'
import { dashboardHandlers }     from './dashboard'
import { proceduresHandlers }    from './procedures'
import { operarioHandlers }      from './operario'
import { floorplanHandlers }     from './floorplan'
import { clientesHandlers }      from './clientes'
import { poeRepositorioHandlers } from './poe-repositorio'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...proceduresHandlers,
  ...operarioHandlers,
  ...floorplanHandlers,
  ...clientesHandlers,
  ...poeRepositorioHandlers,
]
