const httpServer = require("./app");
const { PORT }  = require("./envvar")




const SERVER_PORT = PORT || 5000;
httpServer.listen(SERVER_PORT, () =>
  console.log(`Server is running on http://localhost:${SERVER_PORT}`)
);
