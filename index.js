const app = require('./src/app')

app.listen(process.env.PORT, () => {
  console.log(`Server running. Use our API on port: ${process.env.PORT}`)
})