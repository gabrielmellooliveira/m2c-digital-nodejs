export const getJwtConfigs = () => {
  return {
    global: true,
    secret: process.env.JWT_SECRET || String(''),
    secretOrPrivateKey: process.env.JWT_SECRET || String(),
    signOptions: { expiresIn: '1d' },
  }
};