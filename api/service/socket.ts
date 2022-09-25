import { io } from '../index'

export const emitLoadingStatus = (id: string, status: number) => {
  io.emit(id, status)
}
