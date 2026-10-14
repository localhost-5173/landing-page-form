"use strict";
// Bano Qabil — Incubation Center Internship Landing Page
// Dynamically connected with Bano Qabil IMS Backend APIs

// ==========================================
// 1. API Configuration & Constants
// ==========================================
const API_BASE = (typeof API_CONFIG !== "undefined" && API_CONFIG.BASE_URL)
    ? API_CONFIG.BASE_URL.replace(/\/$/, "")
    : (window.API_BASE_URL ? window.API_BASE_URL.replace(/\/$/, "") : "http://localhost:5000");

const STORAGE_KEY = "bano-qabil-theme";
const STORAGE_DRAFT_KEY = "bano-qabil-registration-draft";

// Official 26 Courses
const OFFICIAL_COURSES = [
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

// Official 32 Karachi Campuses
const OFFICIAL_CAMPUSES = [
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

// Standard 14 Default Fields Specification
const DEFAULT_FORM_SECTIONS = [
    {
        title: "Personal Information",
        fields: [
            { name: "fullName", label: "Full name", type: "text", placeholder: "e.g. MUHAMMAD ALI", required: true, options: [] },
            { name: "dateOfBirth", label: "Date of birth", type: "date", placeholder: "", required: true, options: [] },
            { name: "gender", label: "Gender", type: "radio", placeholder: "", required: true, options: ["Male", "Female"] },
            { name: "cnicNumber", label: "CNIC number", type: "text", placeholder: "e.g. 42101-1234567-1", required: true, options: [] },
            { name: "fatherOrGuardianName", label: "Father/Guardian name", type: "text", placeholder: "e.g. ABDUL REHMAN", required: true, options: [] },
            { name: "aboutYou", label: "About yourself", type: "textarea", placeholder: "Briefly introduce yourself, your interests, skills, and goals...", required: true, options: [] }
        ]
    },
    {
        title: "Contact Information",
        fields: [
            { name: "address", label: "Address", type: "text", placeholder: "e.g. House #, Street, Area, City", required: true, options: [] },
            { name: "emailAddress", label: "Email address", type: "email", placeholder: "e.g. student@example.com", required: true, options: [] },
            { name: "phoneNumber", label: "Phone number", type: "phone", placeholder: "300 1234567", required: true, options: [] },
            { name: "guardianNumber", label: "Guardian number", type: "phone", placeholder: "300 1234567", required: false, options: [] }
        ]
    },
    {
        title: "Course & Campus Details",
        fields: [
            { name: "course", label: "Course", type: "select", placeholder: "Select course", required: true, options: OFFICIAL_COURSES },
            { name: "teacherName", label: "Teacher name", type: "text", placeholder: "e.g. Sir Kashif", required: true, options: [] },
            { name: "campus", label: "Campus", type: "select", placeholder: "Select Karachi campus", required: true, options: OFFICIAL_CAMPUSES },
            { name: "obtainedMarks", label: "Obtained marks", type: "number", placeholder: "e.g. 85 or 85%", required: true, options: [] }
        ]
    }
];

const STANDARD_FIELD_KEYS = new Set([
    "fullName", "name", "full_name", "Full name", "Full Name",
    "dateOfBirth", "dob", "date_of_birth", "Date of birth",
    "gender", "Gender",
    "cnicNumber", "cnic", "cnic_number", "CNIC number",
    "fatherOrGuardianName", "father_name", "father_guardian_name", "Father/Guardian name",
    "aboutYou", "about", "about_yourself", "About yourself",
    "address", "Address",
    "emailAddress", "email", "email_address", "Email address",
    "phoneNumber", "phone", "phone_number", "Phone number",
    "guardianNumber", "guardian_phone", "guardian_number", "Guardian number",
    "course", "Course",
    "teacherName", "teacher", "teacher_name", "Teacher name",
    "campus", "Campus",
    "obtainedMarks", "marks", "obtained_marks", "Obtained marks"
]);

// ==========================================
// 2. Theme Toggle & UI Initialization
// ==========================================
function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
}

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;
    applyTheme(getPreferredTheme());
    toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!menuBtn || !drawer) return;

    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : drawer.hidden;
        drawer.hidden = !isOpen;
        menuBtn.classList.toggle("active", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    }

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    drawer.querySelectorAll("a, button").forEach((item) => {
        item.addEventListener("click", () => toggleMenu(false));
    });

    document.addEventListener("click", (e) => {
        if (!drawer.hidden && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMenu(false);
        }
    });
}

// ==========================================
// 3. Dynamic Form State & Engine
// ==========================================
let currentFormSections = DEFAULT_FORM_SECTIONS;
let currentStep = 1;
let TOTAL_STEPS = DEFAULT_FORM_SECTIONS.length;
let renderedFieldDefs = [];

// Convert backend grouped data into ordered sections
function processBackendFormConfig(groupedData) {
    if (!groupedData || typeof groupedData !== "object" || Object.keys(groupedData).length === 0) {
        return DEFAULT_FORM_SECTIONS;
    }

    const sectionMap = new Map();
    sectionMap.set("Personal Information", []);
    sectionMap.set("Contact Information", []);
    sectionMap.set("Course & Campus Details", []);

    Object.entries(groupedData).forEach(([secName, fields]) => {
        if (!Array.isArray(fields)) return;
        const lowerSec = (secName || "").toLowerCase().trim();
        let targetSec = secName;

        if (lowerSec.includes("personal")) {
            targetSec = "Personal Information";
        } else if (lowerSec.includes("contact")) {
            targetSec = "Contact Information";
        } else if (lowerSec.includes("course") || lowerSec.includes("campus")) {
            targetSec = "Course & Campus Details";
        }

        if (!sectionMap.has(targetSec)) {
            sectionMap.set(targetSec, []);
        }

        const list = sectionMap.get(targetSec);
        fields.forEach((f) => {
            let opts = Array.isArray(f.options) ? f.options : [];
            // Preserve official course/campus options if backend returns empty or incomplete
            if (f.name === "course" && opts.length === 0) opts = OFFICIAL_COURSES;
            if (f.name === "campus" && opts.length === 0) opts = OFFICIAL_CAMPUSES;

            list.push({
                id: f._id || f.id || f.name,
                name: f.name || f.label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
                label: f.label || f.name,
                type: f.type || "text",
                placeholder: f.placeholder || "",
                required: Boolean(f.required),
                options: opts,
                section: targetSec
            });
        });
    });

    const result = [];
    sectionMap.forEach((fields, title) => {
        if (fields.length > 0) {
            result.push({ title, fields });
        }
    });

    return result.length > 0 ? result : DEFAULT_FORM_SECTIONS;
}

// Generate field HTML string
function renderFieldHtml(field) {
    const reqStar = field.required ? '<span class="required-star" aria-hidden="true">*</span>' : '';
    const optionalTag = !field.required ? '<span class="optional-tag">(optional)</span>' : '';
    const fieldId = `field-${field.name}`;
    const errorId = `error-${field.name}`;
    const name = field.name;
    const type = field.type;
    const placeholder = field.placeholder || "";
    const isUppercase = ["fullName", "name", "fatherOrGuardianName", "father_name"].includes(name);

    if (type === "textarea") {
        return `
            <div class="form-row" data-field-name="${name}">
                <label for="${fieldId}">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
                <textarea id="${fieldId}" name="${name}" rows="3" placeholder="${escapeHtml(placeholder)}" ${field.required ? "required" : ""}></textarea>
                <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
            </div>
        `;
    }

    if (type === "select") {
        const optionsHtml = (field.options || []).map(opt => `
            <option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>
        `).join("");

        return `
            <div class="form-row" data-field-name="${name}">
                <label for="${fieldId}">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
                <select id="${fieldId}" name="${name}" ${field.required ? "required" : ""}>
                    <option value="" selected disabled>${escapeHtml(placeholder || "Select " + field.label)}</option>
                    ${optionsHtml}
                </select>
                <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
            </div>
        `;
    }

    if (type === "radio") {
        const options = field.options && field.options.length > 0 ? field.options : ["Male", "Female"];
        const radioCardsHtml = options.map((opt, idx) => `
            <label class="radio-card">
                <input type="radio" name="${name}" id="${fieldId}-${idx}" value="${escapeHtml(opt)}" ${field.required ? "required" : ""} />
                <span>${escapeHtml(opt)}</span>
            </label>
        `).join("");

        return `
            <div class="form-row" data-field-name="${name}">
                <label id="${fieldId}-label">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
                <div class="gender-radio-group" role="radiogroup" aria-labelledby="${fieldId}-label">
                    ${radioCardsHtml}
                </div>
                <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
            </div>
        `;
    }

    if (type === "checkbox") {
        const options = field.options && field.options.length > 0 ? field.options : [field.label];
        const checkCardsHtml = options.map((opt, idx) => `
            <label class="checkbox-card">
                <input type="checkbox" name="${name}" id="${fieldId}-${idx}" value="${escapeHtml(opt)}" />
                <span>${escapeHtml(opt)}</span>
            </label>
        `).join("");

        return `
            <div class="form-row" data-field-name="${name}">
                <label id="${fieldId}-label">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
                <div class="checkbox-grid">
                    ${checkCardsHtml}
                </div>
                <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
            </div>
        `;
    }

    if (type === "phone" || name.toLowerCase().includes("phone") || name.toLowerCase().includes("guardian")) {
        return `
            <div class="form-row" data-field-name="${name}">
                <label for="${fieldId}">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
                <div class="phone-input-wrap">
                    <span class="phone-prefix">+92</span>
                    <input type="tel" id="${fieldId}" name="${name}" placeholder="${escapeHtml(placeholder || "300 1234567")}" maxlength="11" autocomplete="tel" ${field.required ? "required" : ""} />
                </div>
                <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
            </div>
        `;
    }

    const inputType = type === "number" ? "number" :
                      type === "email" ? "email" :
                      type === "date" ? "date" :
                      type === "password" ? "password" :
                      type === "file" ? "file" : "text";

    const isCnic = name.toLowerCase().includes("cnic");

    return `
        <div class="form-row" data-field-name="${name}">
            <label for="${fieldId}">${escapeHtml(field.label)} ${reqStar} ${optionalTag}</label>
            <input type="${inputType}" id="${fieldId}" name="${name}" class="${isUppercase ? "input-uppercase" : ""}" placeholder="${escapeHtml(placeholder)}" ${isCnic ? 'maxlength="15" autocomplete="off"' : ""} ${field.required ? "required" : ""} />
            <span class="form-error" id="${errorId}" role="alert" aria-live="polite"></span>
        </div>
    `;
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Render dynamic steps DOM from currentFormSections
function renderDynamicFormDom() {
    const container = document.getElementById("form-steps-container");
    if (!container) return;

    TOTAL_STEPS = currentFormSections.length;
    renderedFieldDefs = [];

    let stepsHtml = "";

    currentFormSections.forEach((sec, secIdx) => {
        const stepNum = secIdx + 1;
        const isActive = stepNum === currentStep;

        stepsHtml += `
            <div class="form-step ${isActive ? "active" : ""}" id="form-step-${stepNum}" data-step="${stepNum}" ${!isActive ? "hidden" : ""}>
                <div class="form-section-title">
                    <span class="form-section-num">${stepNum}</span>
                    <span>${escapeHtml(sec.title)}</span>
                </div>
        `;

        const fields = sec.fields || [];
        let i = 0;
        while (i < fields.length) {
            const f1 = fields[i];
            const f2 = fields[i + 1];
            renderedFieldDefs.push(f1);

            // Check if f1 and f2 can be placed side-by-side in .form-row-split
            const isSplitCandidate1 = f1.type !== "textarea" && f1.name !== "fullName" && f1.name !== "address" && f1.name !== "aboutYou";
            const isSplitCandidate2 = f2 && f2.type !== "textarea" && f2.name !== "fullName" && f2.name !== "address" && f2.name !== "aboutYou";

            if (isSplitCandidate1 && isSplitCandidate2) {
                renderedFieldDefs.push(f2);
                stepsHtml += `
                    <div class="form-row-split">
                        <div>${renderFieldHtml(f1)}</div>
                        <div>${renderFieldHtml(f2)}</div>
                    </div>
                `;
                i += 2;
            } else {
                stepsHtml += renderFieldHtml(f1);
                i += 1;
            }
        }

        stepsHtml += `</div>`;
    });

    container.innerHTML = stepsHtml;
    attachDynamicEventListeners();
    updateStepUI();
}

// ==========================================
// 4. Form Validation & Draft Persistence
// ==========================================
function getFieldElement(fieldName) {
    return document.querySelector(`[name="${fieldName}"]`);
}

function getFieldContainer(name) {
    const el = document.querySelector(`[data-field-name="${name}"]`);
    if (el) return el;
    const input = getFieldElement(name);
    return input?.closest(".form-row, .form-row-split > div");
}

function getErrorEl(fieldName) {
    return document.getElementById(`error-${fieldName}`);
}

function setFieldError(fieldName, message) {
    const container = getFieldContainer(fieldName);
    const errorEl = getErrorEl(fieldName);
    const input = getFieldElement(fieldName);

    if (container) container.classList.add("has-error");
    if (input) input.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldName) {
    const container = getFieldContainer(fieldName);
    const errorEl = getErrorEl(fieldName);
    const input = getFieldElement(fieldName);

    if (container) container.classList.remove("has-error");
    if (input) input.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
}

function clearAllErrors() {
    renderedFieldDefs.forEach(f => clearFieldError(f.name));
    const serverErr = document.getElementById("form-server-error-banner");
    if (serverErr) serverErr.remove();
}

function validateSingleField(field) {
    const name = field.name;
    const type = field.type;
    const isRequired = Boolean(field.required);

    // Radio validation
    if (type === "radio") {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (isRequired && !checked) {
            setFieldError(name, `Please select an option for ${field.label}.`);
            return false;
        }
        clearFieldError(name);
        return true;
    }

    // Checkbox validation
    if (type === "checkbox") {
        const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
        if (isRequired && checked.length === 0) {
            setFieldError(name, `Please select at least one option.`);
            return false;
        }
        clearFieldError(name);
        return true;
    }

    const input = getFieldElement(name);
    if (!input) return true;
    const val = input.value ? input.value.trim() : "";

    // Required check
    if (isRequired && !val) {
        setFieldError(name, `Please provide your ${field.label.toLowerCase()}.`);
        return false;
    }

    if (!val) {
        clearFieldError(name);
        return true;
    }

    // Specific rules for known fields
    if (name === "fullName" || name === "name") {
        if (val.length < 2) {
            setFieldError(name, "Full name must be at least 2 characters.");
            return false;
        }
    }

    if (name === "fatherOrGuardianName" || name === "father_name") {
        if (val.length < 2) {
            setFieldError(name, "Father/Guardian name must be at least 2 characters.");
            return false;
        }
    }

    if (name === "address" && val.length < 5) {
        setFieldError(name, "Please enter a valid complete address.");
        return false;
    }

    if (type === "email" || name === "emailAddress" || name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            setFieldError(name, "Please enter a valid email address (e.g. student@example.com).");
            return false;
        }
    }

    if (type === "phone" || name === "phoneNumber" || name === "guardianNumber" || name.includes("phone")) {
        let digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.startsWith("92") && digitsOnly.length === 12) digitsOnly = digitsOnly.substring(2);
        else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) digitsOnly = digitsOnly.substring(1);

        if (digitsOnly.length !== 10) {
            setFieldError(name, "Phone number must contain 10 digits (e.g. 300 1234567).");
            return false;
        }
        if (digitsOnly[0] !== "3") {
            setFieldError(name, "Pakistani mobile number must start with 3.");
            return false;
        }
        if (/^30{9}$/.test(digitsOnly) || /^(\d)\1{9}$/.test(digitsOnly)) {
            setFieldError(name, "Please enter a valid phone number.");
            return false;
        }
    }

    if (name === "cnicNumber" || name === "cnic") {
        const digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.length !== 13) {
            setFieldError(name, "CNIC must contain exactly 13 digits (e.g. 42101-1234567-1).");
            return false;
        }
        if (digitsOnly[0] !== "4") {
            setFieldError(name, "CNIC must start with 4 (e.g. 42101-1234567-1).");
            return false;
        }
        if (/^40{12}$/.test(digitsOnly) || /^(\d)\1{12}$/.test(digitsOnly)) {
            setFieldError(name, "Please enter a valid CNIC number.");
            return false;
        }
    }

    if (name === "obtainedMarks" || name === "marks") {
        const num = parseFloat(val);
        if (isNaN(num) || num < 0) {
            setFieldError(name, "Please enter valid obtained marks or percentage.");
            return false;
        }
    }

    if (name === "aboutYou" || name === "about") {
        if (val.length < 10) {
            setFieldError(name, "Please enter at least 10 characters introducing yourself.");
            return false;
        }
    }

    clearFieldError(name);
    return true;
}

function validateStep(stepNum) {
    if (stepNum < 1 || stepNum > currentFormSections.length) return true;
    const sec = currentFormSections[stepNum - 1];
    if (!sec || !sec.fields) return true;

    let hasError = false;
    let firstInvalidEl = null;

    sec.fields.forEach((field) => {
        const isValid = validateSingleField(field);
        if (!isValid) {
            hasError = true;
            if (!firstInvalidEl) {
                firstInvalidEl = getFieldElement(field.name) || getFieldContainer(field.name);
            }
        }
    });

    if (hasError && firstInvalidEl) {
        firstInvalidEl.focus?.();
        firstInvalidEl.scrollIntoView?.({ behavior: "smooth", block: "center" });
        return false;
    }

    return !hasError;
}

function saveFormDraft() {
    try {
        const draft = { currentStep };
        renderedFieldDefs.forEach((field) => {
            const name = field.name;
            if (field.type === "radio") {
                draft[name] = document.querySelector(`input[name="${name}"]:checked`)?.value || "";
            } else if (field.type === "checkbox") {
                const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
                draft[name] = checked;
            } else {
                const el = getFieldElement(name);
                draft[name] = el?.value || "";
            }
        });
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {}
}

function loadFormDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
        if (!raw) return false;
        const draft = JSON.parse(raw);
        if (!draft || typeof draft !== "object") return false;

        renderedFieldDefs.forEach((field) => {
            const name = field.name;
            const val = draft[name];
            if (val === undefined || val === null) return;

            if (field.type === "radio") {
                const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
                if (radio) radio.checked = true;
            } else if (field.type === "checkbox" && Array.isArray(val)) {
                val.forEach(v => {
                    const chk = document.querySelector(`input[name="${name}"][value="${v}"]`);
                    if (chk) chk.checked = true;
                });
            } else {
                const el = getFieldElement(name);
                if (el) el.value = val;
            }
        });

        if (draft.currentStep && draft.currentStep >= 1 && draft.currentStep <= TOTAL_STEPS) {
            currentStep = draft.currentStep;
            updateStepUI();
        }
        return true;
    } catch (e) {
        return false;
    }
}

function clearFormDraft() {
    try {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch (e) {}
}

// Auto format CNIC: 42101-1234567-1
function setupCnicFormatter(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 13) val = val.substring(0, 13);
        let formatted = val;
        if (val.length > 5 && val.length <= 12) {
            formatted = `${val.substring(0, 5)}-${val.substring(5)}`;
        } else if (val.length > 12) {
            formatted = `${val.substring(0, 5)}-${val.substring(5, 12)}-${val.substring(12, 13)}`;
        }
        e.target.value = formatted;
        saveFormDraft();
    });
}

// Phone formatters for +92 prefix inputs
function setupPhoneFormatter(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.startsWith("92") && val.length > 10) val = val.substring(2);
        else if (val.startsWith("0") && val.length > 10) val = val.substring(1);
        if (val.length > 10) val = val.substring(0, 10);
        let formatted = val;
        if (val.length > 3) {
            formatted = `${val.substring(0, 3)} ${val.substring(3)}`;
        }
        e.target.value = formatted;
        saveFormDraft();
    });
}

function attachDynamicEventListeners() {
    renderedFieldDefs.forEach((field) => {
        const name = field.name;
        const type = field.type;

        if (type === "radio" || type === "checkbox") {
            const inputs = document.querySelectorAll(`input[name="${name}"]`);
            inputs.forEach((input) => {
                input.addEventListener("change", () => {
                    const container = getFieldContainer(name);
                    if (container?.classList.contains("has-error")) {
                        validateSingleField(field);
                    }
                    saveFormDraft();
                });
            });
        } else {
            const input = getFieldElement(name);
            if (!input) return;

            if (name.toLowerCase().includes("cnic")) {
                setupCnicFormatter(input);
            }
            if (type === "phone" || name.toLowerCase().includes("phone") || name.toLowerCase().includes("guardian")) {
                setupPhoneFormatter(input);
            }

            input.addEventListener("input", () => {
                const container = getFieldContainer(name);
                if (container?.classList.contains("has-error")) {
                    validateSingleField(field);
                }
                saveFormDraft();
            });

            if (type === "select" || type === "date") {
                input.addEventListener("change", () => {
                    const container = getFieldContainer(name);
                    if (container?.classList.contains("has-error")) {
                        validateSingleField(field);
                    }
                    saveFormDraft();
                });
            }
        }
    });
}

// ==========================================
// 5. Multi-Step Form Navigation
// ==========================================
function updateStepUI() {
    TOTAL_STEPS = currentFormSections.length;
    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const stepEl = document.getElementById(`form-step-${i}`);
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

    const currentTitle = currentFormSections[currentStep - 1]?.title || "Registration Details";
    const percentage = Math.round((currentStep / TOTAL_STEPS) * 100);

    const stepIndicator = document.getElementById("form-step-indicator");
    const stepPercent = document.getElementById("form-step-percent");
    const progressFill = document.getElementById("form-progress-fill");
    const progressBar = document.getElementById("form-progress-bar");
    const prevBtn = document.getElementById("form-prev-btn");
    const nextBtn = document.getElementById("form-next-btn");
    const submitBtn = document.getElementById("register-submit-btn");

    if (stepIndicator) stepIndicator.textContent = `Step ${currentStep} of ${TOTAL_STEPS} — ${currentTitle}`;
    if (stepPercent) stepPercent.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(currentStep));
        progressBar.setAttribute("aria-valuemax", String(TOTAL_STEPS));
    }

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
    if (currentStep === TOTAL_STEPS) {
        if (nextBtn) nextBtn.style.display = "none";
        if (submitBtn) submitBtn.style.display = "inline-flex";
    } else {
        if (nextBtn) nextBtn.style.display = "inline-flex";
        if (submitBtn) submitBtn.style.display = "none";
    }
}

function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > TOTAL_STEPS) return;
    currentStep = stepNum;
    updateStepUI();
    saveFormDraft();

    const modalBody = document.querySelector("#register-overlay .modal-body");
    if (modalBody) {
        modalBody.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
        const firstInput = document.querySelector(`#form-step-${currentStep} input:not([type="radio"]):not([type="checkbox"]), #form-step-${currentStep} select`);
        firstInput?.focus();
    }, 100);
}

// ==========================================
// 6. Modal Controls & API Submission
// ==========================================
async function loadFormConfigFromApi() {
    try {
        const response = await fetch(`${API_BASE}/api/form-config`);
        if (!response.ok) {
            console.warn("Could not fetch /api/form-config, status:", response.status);
            return;
        }
        const json = await response.json();
        const grouped = json.data || {};
        if (Object.keys(grouped).length > 0) {
            currentFormSections = processBackendFormConfig(grouped);
            renderDynamicFormDom();
            loadFormDraft();
        }
    } catch (err) {
        console.warn("Backend /api/form-config connection error, using local defaults:", err);
    }
}

function initModals() {
    const registerOverlay = document.getElementById("register-overlay");
    const registerModal = registerOverlay?.querySelector(".modal");
    const modalBody = registerOverlay?.querySelector(".modal-body");
    const openBtns = document.querySelectorAll(".js-open-register");
    const registerCloseBtn = document.getElementById("register-close");
    const form = document.getElementById("register-form");

    const successOverlay = document.getElementById("success-overlay");
    const successModal = successOverlay?.querySelector(".modal");
    const successCloseX = document.getElementById("success-close-x");
    const successCloseBtn = document.getElementById("success-close-btn");

    const prevBtn = document.getElementById("form-prev-btn");
    const nextBtn = document.getElementById("form-next-btn");
    const submitBtn = document.getElementById("register-submit-btn");

    if (!registerOverlay || !registerModal || !form || !modalBody || !successOverlay) return;

    let mouseDownOnRegOverlay = false;
    let mouseDownOnSuccessOverlay = false;

    function openRegisterModal() {
        clearAllErrors();
        // Fetch fresh form config whenever registration modal is opened
        loadFormConfigFromApi();
        const hasDraft = loadFormDraft();
        if (!hasDraft) {
            goToStep(1);
        }
        registerOverlay.hidden = false;
        modalBody.scrollTop = 0;
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            const firstInput = document.querySelector(`#form-step-${currentStep} input:not([type="radio"]):not([type="checkbox"]), #form-step-${currentStep} select`);
            firstInput?.focus();
        }, 100);
    }

    function closeRegisterModal() {
        registerOverlay.hidden = true;
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

    registerModal.addEventListener("click", (e) => e.stopPropagation());
    registerModal.addEventListener("mousedown", (e) => e.stopPropagation());

    registerOverlay.addEventListener("mousedown", (e) => {
        mouseDownOnRegOverlay = e.target === registerOverlay;
    });
    registerOverlay.addEventListener("click", (e) => {
        if (mouseDownOnRegOverlay && e.target === registerOverlay) closeRegisterModal();
        mouseDownOnRegOverlay = false;
    });

    function openSuccessModal() {
        successOverlay.hidden = false;
        document.body.style.overflow = "hidden";
        setTimeout(() => successCloseBtn?.focus(), 100);
    }

    function closeSuccessModal() {
        successOverlay.hidden = true;
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
        if (mouseDownOnSuccessOverlay && e.target === successOverlay) closeSuccessModal();
        mouseDownOnSuccessOverlay = false;
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (!successOverlay.hidden) closeSuccessModal();
            else if (!registerOverlay.hidden) closeRegisterModal();
        }
    });

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

    // Handle Form Submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // If user triggers submit on an earlier step, validate and advance
        if (currentStep < TOTAL_STEPS) {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
            return;
        }

        // Validate all steps from 1 to TOTAL_STEPS
        for (let s = 1; s <= TOTAL_STEPS; s++) {
            if (!validateStep(s)) {
                if (currentStep !== s) {
                    goToStep(s);
                    validateStep(s);
                }
                return;
            }
        }

        // Remove any prior server error banner
        const existingAlert = document.getElementById("form-server-error-banner");
        if (existingAlert) existingAlert.remove();

        // Gather all fields
        const allValues = {};
        renderedFieldDefs.forEach((field) => {
            const name = field.name;
            if (field.type === "radio") {
                allValues[name] = document.querySelector(`input[name="${name}"]:checked`)?.value || "";
            } else if (field.type === "checkbox") {
                const chks = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
                allValues[name] = chks.length === 1 ? chks[0] : chks;
            } else {
                const el = getFieldElement(name);
                allValues[name] = el ? el.value.trim() : "";
            }
        });

        // Helper to get value from multiple standard aliases
        function getVal(...keys) {
            for (const k of keys) {
                if (allValues[k] !== undefined && allValues[k] !== "") return allValues[k];
            }
            return "";
        }

        // Construct standard payload structure matching backend InternSubmission model
        const payload = {
            fullName: getVal("fullName", "name", "full_name", "Full name", "Full Name"),
            dateOfBirth: getVal("dateOfBirth", "dob", "date_of_birth", "Date of birth"),
            gender: getVal("gender", "Gender"),
            address: getVal("address", "Address"),
            emailAddress: getVal("emailAddress", "email", "email_address", "Email address"),
            phoneNumber: getVal("phoneNumber", "phone", "phone_number", "Phone number"),
            guardianNumber: getVal("guardianNumber", "guardian_phone", "guardian_number", "Guardian number"),
            cnicNumber: getVal("cnicNumber", "cnic", "cnic_number", "CNIC number"),
            fatherOrGuardianName: getVal("fatherOrGuardianName", "father_name", "father_guardian_name", "Father/Guardian name"),
            course: getVal("course", "Course"),
            teacherName: getVal("teacherName", "teacher", "teacher_name", "Teacher name"),
            campus: getVal("campus", "Campus"),
            obtainedMarks: getVal("obtainedMarks", "marks", "obtained_marks", "Obtained marks"),
            aboutYou: getVal("aboutYou", "about", "about_yourself", "About yourself"),
            dynamicData: {}
        };

        // Collect custom dynamic fields into dynamicData
        Object.entries(allValues).forEach(([key, value]) => {
            if (!STANDARD_FIELD_KEYS.has(key)) {
                payload.dynamicData[key] = value;
            }
        });

        // Prevent duplicate submissions and show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; margin-right: 6px;">
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            Submitting...
        `;

        try {
            const response = await fetch(`${API_BASE}/api/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit application. Please try again.");
            }

            // Success!
            clearFormDraft();
            form.reset();
            currentStep = 1;
            updateStepUI();
            closeRegisterModal();
            openSuccessModal();
        } catch (err) {
            console.error("Registration error:", err);
            const alertDiv = document.createElement("div");
            alertDiv.id = "form-server-error-banner";
            alertDiv.className = "form-server-error";
            alertDiv.textContent = err.message || "An error occurred while submitting your application. Please check your connection and try again.";
            form.insertBefore(alertDiv, form.firstChild);
            alertDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Initialize DOM with defaults and fetch API data
    renderDynamicFormDom();
    loadFormConfigFromApi();
    loadFormDraft();
}

// ==========================================
// 7. App Bootstrap
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileMenu();
    initModals();
});
