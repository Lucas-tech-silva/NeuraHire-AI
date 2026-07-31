import { sendContactForm } from "../api/api.js";
import { showToast } from "../ui/ui.js";

const contactForm = document.querySelector(".contact-form");
export const initForms = () => {
  if (!contactForm) return;

  handleFormButtons();
};

const handleFormButtons = () => {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    let name = formData.get("name");
    let email = formData.get("email");
    let message = formData.get("message");

    const resultado = formValidation(name, email, message);

    if (!resultado) {
      showToast("Preencha todas as informações antes de continuar", "error");
      return;
    }

    const response = await sendContactForm(formData);

    if (!response.ok) {
      showToast("Erro tente novamente daqui alguns minutos", "error");
      return;
    }

    showToast("Mensagem enviada com sucesso", "success");
    contactForm.reset();
  });
};

const formValidation = (name, email, message) => {
  if (!name.trim() || !email.trim() || !message.trim()) {
    return false;
  }

  return true;
};
