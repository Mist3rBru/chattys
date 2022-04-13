import multer from 'multer'
import path from 'path'

const options = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const destination = path.resolve(__dirname, '..', '..', 'public', 'img')
      return cb(null, destination)
    },

    filename: (req, file, cb) => {
      const [name, extension]: string[] = file.originalname.split('.')
      const max = 9999
      const min = 100
      const serial = Math.floor(Math.random() * (max - min)) + min // Get a random integer number between min and max
      const fileName = `${name}_${serial}.${extension}`
      return cb(null, fileName)
    }
  })
}

export default multer(options)
