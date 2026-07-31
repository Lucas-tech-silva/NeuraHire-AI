import { initRouter } from "./router.js";
import { initMobileMenu, initClock } from "../ui/ui.js";
import { initFilterTools, initToolFlow } from "./tools.js";
import { initForms } from "../forms/contact.js";
import { initSettings } from "../settings/settings.js";
import { initChat } from "../chat/chat.js";

initRouter();

initMobileMenu();
initClock();

initFilterTools();
initToolFlow();

initForms();

initSettings();
initChat()