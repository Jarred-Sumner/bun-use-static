export function useStatic(server, routes) {
  // Use an internal API to get the Bun.serve() instance from the node:http
  // Server
  let bunServer = server?.[Symbol.for("::bunternal::")];
  if (!bunServer) {
    if (
      typeof server?.reload === "function" &&
      typeof Bun.serve === "function"
    ) {
      bunServer = server;
    }
  }

  if (!bunServer) {
    throw new Error("Expected a node:http Server or server subclass.");
  }

  // Add the HTML routes to the Bun.serve() instance node:http uses
  bunServer.reload({ static: routes });
}

export default useStatic;
