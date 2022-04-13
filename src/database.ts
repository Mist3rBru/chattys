import { Message, User } from './domain'

const rooms: string[] = ['Node', 'Java', 'PHP']
const users: User[] = []
const messages: Message[] = [{
  author: 'John',
  room: 'Node',
  text: 'Testing date format',
  createdAt: new Date(new Date().setDate(new Date().getDate() - 28))
}, {
  author: 'John',
  room: 'Node',
  text: 'Testing last month',
  createdAt: new Date(new Date().setDate(new Date().getDate() - 28))
}, {
  author: 'Bob',
  room: 'Node',
  text: 'Testing week format',
  createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
}, {
  author: 'Bob',
  room: 'Node',
  text: 'Testing yesterday',
  createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
}, {
  author: 'Will',
  room: 'Node',
  text: "Testing today's format",
  createdAt: new Date()
}]

export { rooms, users, messages }
