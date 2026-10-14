// Bano Qabil — Incubation Center Internship landing page
// Handles light/dark theme toggle with persistence + system-preference fallback,
// full-screen form validation, and dedicated success confirmation modal.

type Theme = "light" | "dark";

const STORAGE_KEY = "bano-qabil-theme";

function getPreferredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function initThemeToggle(): void {
  const toggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement | null;
  if (!toggleBtn) return;

  applyTheme(getPreferredTheme());

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") as Theme;
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

function initModals(): void {
  // Registration Form Modal Elements (Full-Screen)
  const registerOverlay = document.getElementById("register-overlay") as HTMLDivElement | null;
  const registerModal = registerOverlay?.querySelector(".modal") as HTMLDivElement | null;
  const modalBody = registerOverlay?.querySelector(".modal-body") as HTMLDivElement | null;
  const openBtns = document.querySelectorAll<HTMLElement>(".js-open-register");
  const registerCloseBtn = document.getElementById("register-close") as HTMLButtonElement | null;
  const form = document.getElementById("register-form") as HTMLFormElement | null;

  // Dedicated Success Modal Elements
  const successOverlay = document.getElementById("success-overlay") as HTMLDivElement | null;
  const successModal = successOverlay?.querySelector(".modal") as HTMLDivElement | null;
  const successCloseX = document.getElementById("success-close-x") as HTMLButtonElement | null;
  const successCloseBtn = document.getElementById("success-close-btn") as HTMLButtonElement | null;

  if (!registerOverlay || !registerModal || !form || !modalBody || !successOverlay) return;

  let mouseDownOnRegOverlay = false;
  let mouseDownOnSuccessOverlay = false;

  // Form field references
  const nameInput = document.getElementById("reg-name") as HTMLInputElement | null;
  const dobInput = document.getElementById("reg-dob") as HTMLInputElement | null;
  const genderContainer = document.getElementById("gender-group-container") as HTMLElement | null;
  const genderRadios = document.querySelectorAll<HTMLInputElement>('input[name="gender"]');
  const addressInput = document.getElementById("reg-address") as HTMLInputElement | null;
  const emailInput = document.getElementById("reg-email") as HTMLInputElement | null;
  const phoneInput = document.getElementById("reg-phone") as HTMLInputElement | null;
  const guardianPhoneInput = document.getElementById("reg-guardian-phone") as HTMLInputElement | null;
  const cnicInput = document.getElementById("reg-cnic") as HTMLInputElement | null;
  const fatherNameInput = document.getElementById("reg-father-name") as HTMLInputElement | null;
  const courseSelect = document.getElementById("reg-course") as HTMLSelectElement | null;
  const teacherInput = document.getElementById("reg-teacher") as HTMLInputElement | null;
  const campusSelect = document.getElementById("reg-campus") as HTMLSelectElement | null;
  const marksInput = document.getElementById("reg-marks") as HTMLInputElement | null;
  const aboutInput = document.getElementById("reg-about") as HTMLTextAreaElement | null;

  type ValidatableInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  function getContainer(input: ValidatableInput | null): HTMLElement | null {
    if (!input) return null;
    return input.closest(".form-row, .form-row-split > div, .gender-group");
  }

  function getErrorElement(input: ValidatableInput | null): HTMLElement | null {
    if (!input) return null;
    return document.getElementById(`error-${input.id}`);
  }

  function setFieldError(input: ValidatableInput, message: string): void {
    const container = getContainer(input);
    const errorEl = getErrorElement(input);
    if (container) {
      container.classList.add("has-error");
    }
    input.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(input: ValidatableInput): void {
    const container = getContainer(input);
    const errorEl = getErrorElement(input);
    if (container) {
      container.classList.remove("has-error");
    }
    input.removeAttribute("aria-invalid");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function clearGenderError(): void {
    if (genderContainer) {
      genderContainer.classList.remove("has-error");
    }
    const errorEl = document.getElementById("error-gender");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function setGenderError(message: string): void {
    if (genderContainer) {
      genderContainer.classList.add("has-error");
    }
    const errorEl = document.getElementById("error-gender");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearAllErrors(): void {
    const textInputs: (ValidatableInput | null)[] = [
      nameInput, dobInput, addressInput, emailInput, phoneInput,
      guardianPhoneInput, cnicInput, fatherNameInput, courseSelect,
      teacherInput, campusSelect, marksInput, aboutInput
    ];
    textInputs.forEach((field) => {
      if (field) clearFieldError(field);
    });
    clearGenderError();
  }

  const STORAGE_DRAFT_KEY = "bano-qabil-registration-draft";

  interface FormDraft {
    name: string;
    dob: string;
    gender: string;
    cnic: string;
    father_name: string;
    address: string;
    email: string;
    phone: string;
    guardian_phone: string;
    course: string;
    teacher: string;
    campus: string;
    marks: string;
    about: string;
    currentStep: number;
  }

  function saveFormDraft(): void {
    try {
      const selectedGender = (document.querySelector('input[name="gender"]:checked') as HTMLInputElement | null)?.value || "";
      const draft: FormDraft = {
        name: nameInput?.value || "",
        dob: dobInput?.value || "",
        gender: selectedGender,
        cnic: cnicInput?.value || "",
        father_name: fatherNameInput?.value || "",
        address: addressInput?.value || "",
        email: emailInput?.value || "",
        phone: phoneInput?.value || "",
        guardian_phone: guardianPhoneInput?.value || "",
        course: courseSelect?.value || "",
        teacher: teacherInput?.value || "",
        campus: campusSelect?.value || "",
        marks: marksInput?.value || "",
        about: aboutInput?.value || "",
        currentStep: currentStep || 1
      };
      const hasData = Object.entries(draft).some(([k, v]) => k !== "currentStep" && v !== "");
      if (hasData) {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
      }
    } catch (e) {}
  }

  function loadFormDraft(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (!raw) return false;
      const draft: FormDraft = JSON.parse(raw);
      if (!draft || typeof draft !== "object") return false;

      if (draft.name && nameInput) nameInput.value = draft.name;
      if (draft.dob && dobInput) dobInput.value = draft.dob;
      if (draft.gender) {
        genderRadios.forEach((r) => {
          r.checked = r.value === draft.gender;
        });
      }
      if (draft.cnic && cnicInput) cnicInput.value = draft.cnic;
      if (draft.father_name && fatherNameInput) fatherNameInput.value = draft.father_name;
      if (draft.address && addressInput) addressInput.value = draft.address;
      if (draft.email && emailInput) emailInput.value = draft.email;
      if (draft.phone && phoneInput) phoneInput.value = draft.phone;
      if (draft.guardian_phone && guardianPhoneInput) guardianPhoneInput.value = draft.guardian_phone;
      if (draft.course && courseSelect) courseSelect.value = draft.course;
      if (draft.teacher && teacherInput) teacherInput.value = draft.teacher;
      if (draft.campus && campusSelect) campusSelect.value = draft.campus;
      if (draft.marks && marksInput) marksInput.value = draft.marks;
      if (draft.about && aboutInput) aboutInput.value = draft.about;

      if (draft.currentStep && draft.currentStep >= 1 && draft.currentStep <= TOTAL_STEPS) {
        currentStep = draft.currentStep;
        updateStepUI();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearFormDraft(): void {
    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch (e) {}
  }

  function validateField(input: ValidatableInput | null): boolean {
    if (!input) return true;
    const val = input.value ? input.value.trim() : "";

    if (input === nameInput) {
      if (!val) {
        setFieldError(input, "Please enter your full name.");
        return false;
      }
      if (val.length < 2) {
        setFieldError(input, "Full name must be at least 2 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === dobInput) {
      if (!val) {
        setFieldError(input, "Please select your date of birth.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === addressInput) {
      if (!val) {
        setFieldError(input, "Please enter your complete address.");
        return false;
      }
      if (val.length < 5) {
        setFieldError(input, "Please enter a valid address.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === emailInput) {
      if (!val) {
        setFieldError(input, "Please enter your email address.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setFieldError(input, "Please enter a valid email address (e.g. name@example.com).");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === phoneInput) {
      if (!val) {
        setFieldError(input, "Please enter your phone number.");
        return false;
      }
      let digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.startsWith("92") && digitsOnly.length === 12) {
        digitsOnly = digitsOnly.substring(2);
      } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
        digitsOnly = digitsOnly.substring(1);
      }
      if (digitsOnly.length !== 10) {
        setFieldError(input, "Phone number must contain 10 digits (e.g. 300 1234567).");
        return false;
      }
      if (digitsOnly[0] !== "3") {
        setFieldError(input, "Pakistani mobile number must start with 3 (e.g. 300 1234567).");
        return false;
      }
      if (/^30{9}$/.test(digitsOnly) || /^(\d)\1{9}$/.test(digitsOnly)) {
        setFieldError(input, "Please enter a valid phone number.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === guardianPhoneInput) {
      if (val) {
        let digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.startsWith("92") && digitsOnly.length === 12) {
          digitsOnly = digitsOnly.substring(2);
        } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
          digitsOnly = digitsOnly.substring(1);
        }
        if (digitsOnly.length !== 10) {
          setFieldError(input, "Guardian number must contain 10 digits (e.g. 300 1234567).");
          return false;
        }
        if (digitsOnly[0] !== "3") {
          setFieldError(input, "Guardian number must start with 3 (e.g. 300 1234567).");
          return false;
        }
        if (/^30{9}$/.test(digitsOnly) || /^(\d)\1{9}$/.test(digitsOnly)) {
          setFieldError(input, "Please enter a valid guardian phone number.");
          return false;
        }
      }
      clearFieldError(input);
      return true;
    }

    if (input === cnicInput) {
      if (!val) {
        setFieldError(input, "Please enter your CNIC / B-Form number.");
        return false;
      }
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length !== 13) {
        setFieldError(input, "CNIC must contain exactly 13 digits (e.g. 42101-1234567-1).");
        return false;
      }
      if (digitsOnly[0] !== "4") {
        setFieldError(input, "CNIC must start with 4 (e.g. 42101-1234567-1).");
        return false;
      }
      // Reject dummy / all zeros / repetitive test patterns
      if (/^40{12}$/.test(digitsOnly) || /^(\d)\1{12}$/.test(digitsOnly) || /^4(\d)\1{11}$/.test(digitsOnly)) {
        setFieldError(input, "Please enter a valid, non-dummy CNIC number.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === fatherNameInput) {
      if (!val) {
        setFieldError(input, "Please enter your father or guardian name.");
        return false;
      }
      if (val.length < 2) {
        setFieldError(input, "Name must be at least 2 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === courseSelect) {
      if (!val) {
        setFieldError(input, "Please select your course.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === teacherInput) {
      if (!val) {
        setFieldError(input, "Please enter your teacher's name.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === campusSelect) {
      if (!val) {
        setFieldError(input, "Please select your campus.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === marksInput) {
      if (!val) {
        setFieldError(input, "Please enter your obtained marks or percentage.");
        return false;
      }
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        setFieldError(input, "Please enter valid obtained marks.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === aboutInput) {
      if (!val) {
        setFieldError(input, "Please write a brief intro about yourself.");
        return false;
      }
      if (val.length < 10) {
        setFieldError(input, "Please enter at least 10 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    return true;
  }

  function validateGender(): boolean {
    let isSelected = false;
    genderRadios.forEach((radio) => {
      if (radio.checked) isSelected = true;
    });
    if (!isSelected) {
      setGenderError("Please select your gender.");
      return false;
    }
    clearGenderError();
    return true;
  }

  // Attach real-time validation and error clearing + draft saving
  const liveInputs: (ValidatableInput | null)[] = [
    nameInput, dobInput, addressInput, emailInput, phoneInput,
    guardianPhoneInput, cnicInput, fatherNameInput, teacherInput,
    marksInput, aboutInput
  ];

  liveInputs.forEach((input) => {
    input?.addEventListener("input", () => {
      const container = getContainer(input);
      if (container?.classList.contains("has-error")) {
        validateField(input);
      }
      saveFormDraft();
    });
  });

  [courseSelect, campusSelect, dobInput].forEach((select) => {
    select?.addEventListener("change", () => {
      const container = getContainer(select);
      if (container?.classList.contains("has-error")) {
        validateField(select);
      }
      saveFormDraft();
    });
  });

  genderRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (genderContainer?.classList.contains("has-error")) {
        validateGender();
      }
      saveFormDraft();
    });
  });

  // Auto format CNIC: 42101-1234567-1 (max 13 digits)
  cnicInput?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    let val = target.value.replace(/\D/g, "");
    if (val.length > 13) val = val.substring(0, 13);
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.substring(0, 5)}-${val.substring(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.substring(0, 5)}-${val.substring(5, 12)}-${val.substring(12, 13)}`;
    }
    target.value = formatted;
    saveFormDraft();
  });

  // Phone formatters for +92 prefix inputs
  function setupPhoneFormatter(input: HTMLInputElement | null): void {
    if (!input) return;
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      let val = target.value.replace(/\D/g, "");
      if (val.startsWith("92") && val.length > 10) {
        val = val.substring(2);
      } else if (val.startsWith("0") && val.length > 10) {
        val = val.substring(1);
      }
      if (val.length > 10) val = val.substring(0, 10);
      let formatted = val;
      if (val.length > 3) {
        formatted = `${val.substring(0, 3)} ${val.substring(3)}`;
      }
      target.value = formatted;
      saveFormDraft();
    });
  }

  setupPhoneFormatter(phoneInput);
  setupPhoneFormatter(guardianPhoneInput);

  // Centralized Course & Campus Data Structure
  const BANO_QABIL_COURSES: readonly string[] = [
    "AI for Everyone",
    "Backend Development with Node.js",
    "CIT & Programming Foundations",
    "Computer Information and Technology (CIT)",
    "Cyber Security Essentials",
    "Data Analytics & Business Intelligence",
    "DevOps Foundations",
    "Digital Content Creation",
    "Digital Forensic and Ethical Hacking",
    "Digital Journalism",
    "Digital Marketing",
    "E-Commerce Development Mastery",
    "E-Commerce Marketplace",
    "Essentials for AI & Prompt Mastery",
    "Freelancing & Tech Sales Mastery",
    "Frontend Web Development",
    "Game Development with Blender",
    "Game Development with Unity",
    "Generative AI",
    "Graphic Designing",
    "Mobile Application Development with Flutter",
    "Social Media Management",
    "SQA & Test Automation",
    "UI/UX Design with Figma",
    "Video Editing & Animations",
    "Web Development with AI"
  ];

  const BANO_QABIL_CAMPUSES: readonly string[] = [
    "Al Huda Campus (North Karachi - Power House)",
    "Al-Aqsa Campus (Gulshan-e-Iqbal 13D)",
    "Anjuman Complex Campus (Sakhi Hasan)",
    "Askari Degree College (Bahadurabad)",
    "Bahadurabad Campus - Escuela Schooling System",
    "Bahria Town Campus",
    "BanoQabil Shah Latif Town Campus",
    "Clifton Campus",
    "Dr. Mehmood Hussain Campus (Shahfaisal Town)",
    "Etawa Campus (Gulshan-e-Maymar)",
    "Garden Campus",
    "Gulberg Campus",
    "Gulshan-e-Hadeed Campus",
    "Gulshan-e-Iqbal Campus - Circle Social Welfare",
    "HOL Kara Bai Campus (Lyari)",
    "Harmain Campus (P.E.C.H.S-6)",
    "Idara Noor-e-Haq Campus",
    "Jamia Millia School Campus (Shah Faisal)",
    "Jamia Tul Ansar Campus",
    "KMA Protech Institute Campus",
    "Kausar Town Campus (Malir)",
    "Korangi Allah Wala Town Campus",
    "Landhi#6 Campus",
    "Liaquatabad Campus",
    "Metroville Campus",
    "North Karachi Campus - 11L",
    "Orangi Town 11 ½ Campus - Salman Farsi",
    "PIA Society Campus",
    "Pakistan Central Homeopathic Medical College (Nazimabad)",
    "Piston College Campus",
    "SKIT - Keamari Campus",
    "Sherwani Suites Campus"
  ];

  // ===== Multi-Step Form Controls =====
  let currentStep = 1;
  const TOTAL_STEPS = 3;
  const stepTitles = [
    "Personal Information",
    "Contact Information",
    "Course Details"
  ];

  const prevBtn = document.getElementById("form-prev-btn") as HTMLButtonElement | null;
  const nextBtn = document.getElementById("form-next-btn") as HTMLButtonElement | null;
  const submitBtn = document.getElementById("register-submit-btn") as HTMLButtonElement | null;
  const stepIndicator = document.getElementById("form-step-indicator");
  const stepPercent = document.getElementById("form-step-percent");
  const progressFill = document.getElementById("form-progress-fill") as HTMLDivElement | null;
  const progressBar = document.getElementById("form-progress-bar") as HTMLDivElement | null;

  function updateStepUI(): void {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const stepEl = document.getElementById(`form-step-${i}`) as HTMLDivElement | null;
      if (stepEl) {
        if (i === currentStep) {
          stepEl.hidden = false;
          stepEl.classList.add("active");
        } else {
          stepEl.hidden = true;
          stepEl.classList.remove("active");
        }
      }
    }

    const percentage = Math.round((currentStep / TOTAL_STEPS) * 100);

    if (stepIndicator) {
      stepIndicator.textContent = `Step ${currentStep} of ${TOTAL_STEPS} — ${stepTitles[currentStep - 1]}`;
    }
    if (stepPercent) {
      stepPercent.textContent = `${percentage}%`;
    }
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", String(currentStep));
      progressBar.setAttribute("aria-valuemax", String(TOTAL_STEPS));
    }

    if (prevBtn) {
      prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
    }

    if (currentStep === TOTAL_STEPS) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-flex";
    } else {
      if (nextBtn) nextBtn.style.display = "inline-flex";
      if (submitBtn) submitBtn.style.display = "none";
    }
  }

  function goToStep(stepNum: number): void {
    if (stepNum < 1 || stepNum > TOTAL_STEPS) return;
    currentStep = stepNum;
    updateStepUI();
    saveFormDraft();

    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      if (currentStep === 1) nameInput?.focus();
      else if (currentStep === 2) addressInput?.focus();
      else if (currentStep === 3) courseSelect?.focus();
    }, 100);
  }

  function validateStep(stepNum: number): boolean {
    let firstInvalid: HTMLElement | null = null;
    let hasError = false;

    function checkField(field: ValidatableInput | null): void {
      if (field) {
        const isValid = validateField(field);
        if (!isValid) {
          hasError = true;
          if (!firstInvalid) firstInvalid = field;
        }
      }
    }

    if (stepNum === 1) {
      checkField(nameInput);
      checkField(dobInput);
      const isGenderValid = validateGender();
      if (!isGenderValid) {
        hasError = true;
        if (!firstInvalid) {
          firstInvalid = document.getElementById("gender-male") || genderContainer;
        }
      }
      checkField(cnicInput);
      checkField(fatherNameInput);
      checkField(aboutInput);
    } else if (stepNum === 2) {
      checkField(addressInput);
      checkField(emailInput);
      checkField(phoneInput);
      checkField(guardianPhoneInput);
    } else if (stepNum === 3) {
      checkField(courseSelect);
      checkField(teacherInput);
      checkField(campusSelect);
      checkField(marksInput);
    }

    if (hasError && firstInvalid) {
      firstInvalid.focus?.();
      firstInvalid.scrollIntoView?.({ behavior: "smooth", block: "center" });
      return false;
    }

    return !hasError;
  }

  nextBtn?.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  // ===== Register Modal Controls (Full-Screen) =====
  function openRegisterModal(): void {
    clearAllErrors();
    const hasDraft = loadFormDraft();
    if (!hasDraft) {
      goToStep(1);
    }
    if (registerOverlay) registerOverlay.hidden = false;
    if (modalBody) modalBody.scrollTop = 0;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (currentStep === 1) nameInput?.focus();
      else if (currentStep === 2) addressInput?.focus();
      else if (currentStep === 3) courseSelect?.focus();
    }, 100);
  }

  function closeRegisterModal(): void {
    if (registerOverlay) registerOverlay.hidden = true;
    document.body.style.overflow = "";
    clearAllErrors();
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openRegisterModal();
    });
  });

  registerCloseBtn?.addEventListener("click", closeRegisterModal);

  // Stop propagation inside register modal
  registerModal?.addEventListener("click", (e) => e.stopPropagation());
  registerModal?.addEventListener("mousedown", (e) => e.stopPropagation());

  registerOverlay.addEventListener("mousedown", (e) => {
    mouseDownOnRegOverlay = e.target === registerOverlay;
  });
  registerOverlay.addEventListener("click", (e) => {
    if (mouseDownOnRegOverlay && e.target === registerOverlay)
      closeRegisterModal();
    mouseDownOnRegOverlay = false;
  });

  // ===== Success Modal Controls =====
  function openSuccessModal(): void {
    if (successOverlay) successOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      successCloseBtn?.focus();
    }, 100);
  }

  function closeSuccessModal(): void {
    if (successOverlay) successOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  successCloseX?.addEventListener("click", closeSuccessModal);
  successCloseBtn?.addEventListener("click", closeSuccessModal);

  successModal?.addEventListener("click", (e) => e.stopPropagation());
  successModal?.addEventListener("mousedown", (e) => e.stopPropagation());

  successOverlay.addEventListener("mousedown", (e) => {
    mouseDownOnSuccessOverlay = e.target === successOverlay;
  });
  successOverlay.addEventListener("click", (e) => {
    if (mouseDownOnSuccessOverlay && e.target === successOverlay)
      closeSuccessModal();
    mouseDownOnSuccessOverlay = false;
  });

  // Handle Escape Key for both modals
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (successOverlay && !successOverlay.hidden) {
        closeSuccessModal();
      } else if (registerOverlay && !registerOverlay.hidden) {
        closeRegisterModal();
      }
    }
  });

  // ===== Form Submission =====
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();

    // If user triggers submit (e.g. Enter key) on an earlier step, validate and advance
    if (currentStep < TOTAL_STEPS) {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
      return;
    }

    // On the final step, validate all steps from 1 to 4
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      if (!validateStep(s)) {
        if (currentStep !== s) {
          goToStep(s);
          validateStep(s);
        }
        return; // Submission failed -> data remains in localStorage!
      }
    }

    // All fields are valid and submission succeeded:
    // 1. Close the registration form modal cleanly
    closeRegisterModal();

    // 2. Remove saved draft from localStorage ONLY after successful submission
    clearFormDraft();

    // 3. Reset form and reset step state
    form.reset();
    currentStep = 1;
    updateStepUI();

    // 4. Open the dedicated Success Confirmation Modal
    openSuccessModal();
  });

  // Load any saved draft on initialization
  loadFormDraft();
}

function initMobileMenu(): void {
  const menuBtn = document.getElementById("mobile-menu-btn") as HTMLButtonElement | null;
  const drawer = document.getElementById("mobile-nav-drawer") as HTMLDivElement | null;
  if (!menuBtn || !drawer) return;

  function toggleMenu(open?: boolean): void {
    if (!drawer || !menuBtn) return;
    const isOpen = open !== undefined ? open : drawer.hidden;
    drawer.hidden = !isOpen;
    menuBtn.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  }

  menuBtn.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    toggleMenu();
  });

  drawer.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  document.addEventListener("click", (e: MouseEvent) => {
    if (!drawer.hidden && !drawer.contains(e.target as Node) && !menuBtn.contains(e.target as Node)) {
      toggleMenu(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initModals();
  initMobileMenu();
});
