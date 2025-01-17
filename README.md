# bun-use-static

Bundle frontend applications in existing Express, Fastify, and other Node.js frameworks with Bun.

To install:

```bash
bun install bun-use-static
```

### Express usage:

```ts
import useStatic from "bun-use-static";
import app from "./my-express-app";
import mySinglePageApp from "./my-single-page-app.html";

// Get the node:http Server from calling app.listen()
const server = app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});

useStatic(server, {
  "/dashboard": mySinglePageApp,
});
```

Now, when you go to `http://localhost:3000/dashboard`, you'll see your app bundled automatically.

### node:http usage:

```ts
import useStatic from "bun-use-static";
import { createServer } from "node:http";
import mySinglePageApp from "./my-single-page-app.html";

const server = createServer((req, res) => {
  res.end("Hello World!");
});

useStatic(server, {
  "/dashboard": mySinglePageApp,
});
```

Note: you will need `--experimental-html` to use this:

```bash
bun --experimental-html my-app.js
```

### How this works:

Under the hood, `useStatic` calls `reload` on the Bun.serve() instance that node:http uses internally.

Here is the code in the library:

```ts
export function useStatic(server, routes) {
  // Use an internal API to get the Bun.serve() instance from the node:http
  let bunServer = server?.[Symbol.for("::bunternal::")];

  if (!bunServer) {
    if (typeof server?.once === "function") {
      server.once("listening", () => {
        bunServer = server[Symbol.for("::bunternal::")];
        if (!bunServer) {
          throw new Error("Expected a node:http Server or server subclass.");
        }
        bunServer.reload({ static: routes });
      });
      return;
    }
  }

  if (!bunServer) {
    throw new Error("Expected a node:http Server or server subclass.");
  }

  // Add the HTML routes to the Bun.serve() instance node:http uses
  bunServer.reload({ static: routes });
}

export default useStatic;
```

See [the docs](https://bun.sh/docs/bundler/fullstack) for more information.
