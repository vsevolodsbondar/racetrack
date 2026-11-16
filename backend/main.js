const http = require("http")
const routes = require("./routes.js")

const server = http.createServer((req, res) => {
  //тупо берет из МАПА routes по ключу нужную функцию (можно ли их называть хендлерами?? хз). Крч типа MUX в гоу но сильно-сильно проще.
  const handler = routes[`${req.method}:${req.url}`] || routes['404'] //если ключа нет то вызовется 404 ОН ТОЧНО ЕСТЬ

  handler(req, res) // дергаем хендлер собсна
})

server.listen(3000, () => {
  console.log('Address: http://localhost:3000')
})
