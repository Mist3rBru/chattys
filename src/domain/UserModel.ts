export type UserParams = Omit<User, 'socketId'>

export type User = {
  socketId: string
  name: string
  room: string
}
