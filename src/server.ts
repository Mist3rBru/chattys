import { httpServer } from './app'
import './websocket'

httpServer.listen(3030, () => {
  console.log('🚀 Server listening on http://localhost:3030')
})
