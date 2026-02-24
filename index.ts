import { initApp } from "@app/init/index.ts";
import Router from "@app/providers/router/Router.ts";
import "@app/styles/index.css";

try {
  /* i18n.init() runs before any page modules load */
  await initApp();
} catch (e) {
  console.error("index.ts: initialization failed", e);
} finally {
  /* dynamic import of routes and their configs
    for i18n dictionaries get loaded beforehand */
  const { registerRoutes } = await import("@app/providers/router/routes.ts");
  registerRoutes();

  Router.start();
}
