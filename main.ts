import { Application, Router } from "oak";
import { load } from "dotenv";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// Load environment variables
const env = await load();

const app = new Application();
const router = new Router();

// Enable CORS
app.use(oakCors());

// Serve static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// API routes
router.get("/api/safe/:id", async (ctx) => {
  const { id } = ctx.params;
  // TODO: Implement safe retrieval
  ctx.response.body = { snippets: [] };
});

router.post("/api/safe/:id", async (ctx) => {
  const { id } = ctx.params;
  const body = await ctx.request.body().value;
  // TODO: Implement snippet saving
  ctx.response.body = { success: true };
});

router.delete("/api/safe/:id/:snippetId", async (ctx) => {
  const { id, snippetId } = ctx.params;
  // TODO: Implement snippet deletion
  ctx.response.body = { success: true };
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = parseInt(env.PORT || "8000");
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port }); 