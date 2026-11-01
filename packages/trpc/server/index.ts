import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { publicFormRouter } from "./routes/public-form/route";

export const serverRouter = router({
    health: healthRouter,
    auth: authRouter,
    form: formRouter,
    publicForm: publicFormRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
