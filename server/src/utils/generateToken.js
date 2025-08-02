import jwt from 'jsonwebtoken'

export default function generatedToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("SECRET_KEY_TOKEN is not defined in env")
  }
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // zarurat ke mutabiq adjust karo
  )
}
