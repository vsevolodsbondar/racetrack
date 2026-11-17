## <number>. <short title>

- **Asked:** what you asked AI to do.
- **Kept:** what you used as it was.
- **Changed or rejected:** what you changed or threw away, and why.

## <1>.<bug search>

- **Asked:** Why I receive error during server start with .env config:"(node:2640) Warning: Accessing non-existent property 'PORT' of module exports inside circular dependency"
- **Kept:** kept the change in import from "const config = require('./')" => "const config = require('./config')"
- **Changed or rejected:** changed my code as it suggested.