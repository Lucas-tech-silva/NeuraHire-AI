import { initRouter } from "./router.js";
import { initMobileMenu, initClock } from "../ui/ui.js";
import { initFilterTools, initToolFlow } from "./tools.js";

initRouter();

initMobileMenu();
initClock();

initFilterTools();
initToolFlow();
