# Bano Qabil Incubation Center — Internship Landing Page

A modern, responsive, and accessible landing page designed for the **Bano Qabil Incubation Center Internship Program**. The website showcases program details, eligibility criteria, internship highlights, and an interactive 4-step full-screen application form with real-time validation and dark/light theme support.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Purpose of the Website](#-purpose-of-the-website)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Project Folder Structure](#-project-folder-structure)
- [Installation and Setup Instructions](#-installation-and-setup-instructions)
- [How to Run the Project Locally](#-how-to-run-the-project-locally)
- [Registration Form Details and Functionality](#-registration-form-details-and-functionality)
- [Responsive Design and Theme Toggle](#-responsive-design-and-theme-toggle)
- [Future Improvements](#-future-improvements)

---

## 🌟 Project Overview

The **Bano Qabil Incubation Center Internship Landing Page** is a dedicated web portal built to connect aspiring students, matric/intermediate graduates, and tech enthusiasts with hands-on internship opportunities. It presents program offerings clearly and enables applicants to register seamlessly through a guided multi-step form.

---

## 🎯 Purpose of the Website

- **Inform:** Provide clear information regarding program objectives, mentor guidance, real-world projects, and skill-building activities.
- **Engage:** Offer an intuitive, accessible, and interactive user experience across all device sizes (mobile, tablet, desktop).
- **Streamline Applications:** Facilitate candidate registration through a 4-step validated application modal and instant confirmation.

---

## ✨ Key Features

- **Hero Section with Dynamic Emblem:** Includes statistics badges, interactive call-to-actions, and an animated circular emblem.
- **Comprehensive Sections:**
  - **About the Program:** Core mission, impact metrics, and value proposition.
  - **Who Can Apply (Eligibility):** Welcoming criteria for Matric, Intermediate, and higher education students.
  - **Internship Details:** Key information on flexible duration, on-site environment, flexible hours, and skill-building activities.
  - **How to Apply:** Four-step illustrated roadmap with direct "Open Registration Form" CTA.
  - **Call to Action & Footer:** Quick access links, direct email contact, and social links (Instagram & Facebook).
- **Interactive Multi-Step Registration Modal:**
  - 4-step progressive form (Personal Info, Contact Info, Course Details, About You).
  - Real-time input validation, custom error messaging, and CNIC auto-formatting (`XXXXX-XXXXXXX-X`).
  - Next / Previous step navigation preserving all user input.
  - Animated progress indicator and percentage bar.
- **Dedicated Success Confirmation Screen:** Clean, distraction-free confirmation modal displayed upon successful submission.
- **Light & Dark Theme Toggle:** Persistent theme switching using `localStorage` with automatic system preference detection (`prefers-color-scheme`).
- **Mobile Navigation Drawer:** Responsive slide-down menu for mobile and small screens.

---

## 💻 Technologies Used

- **HTML5:** Semantic document structure, accessible ARIA attributes, and form validation markup.
- **Vanilla CSS3:** Custom CSS variables (design tokens), CSS Grid, Flexbox, smooth transitions, keyframe animations, and mobile-first media queries.
- **Vanilla JavaScript (ES6+) / TypeScript:** DOM manipulation, multi-step state management, real-time input validation, modal handling, and theme persistence.
- **SVG Icons:** Scalable vector icons embedded directly for optimal rendering and zero external icon library dependencies.

---

## 📁 Project Folder Structure

```text
bano-qabil-landing-page/
├── assets/                       # Image assets and brand logos
│   ├── bano-qabil-logo.png
│   ├── logo-transparent.png
│   └── logo.png
├── index.html                    # Main HTML document
├── styles.css                    # Comprehensive stylesheet (design tokens, layouts, responsive rules)
├── script.js                     # Executable JavaScript logic for modals, form validation, theme toggle
├── script.ts                     # TypeScript source file mirroring application logic
└── README.md                     # Project documentation
```

---

## ⚙️ Installation and Setup Instructions

This project is built using standard web technologies with no external build tools, package managers, or runtime dependencies required.

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- (Optional) A code editor such as [Visual Studio Code](https://code.visualstudio.com/).

### Setup Steps
1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/heyalii2307-cmyk/BQ-Interns-hiring.git
   ```
2. Navigate into the project folder:
   ```bash
   cd bano-qabil-landing-page
   ```

---

## 🚀 How to Run the Project Locally

You can run the project using any of the following methods:

### Method 1: Direct File Open
- Simply double-click `index.html` or right-click `index.html` and select **Open With** -> **Your Preferred Browser**.

### Method 2: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension by Ritwick Dey.
3. Click **"Go Live"** in the bottom status bar or right-click `index.html` and select **"Open with Live Server"**.
4. The site will automatically open at `http://127.0.0.1:5500/`.

### Method 3: Simple Python HTTP Server
If you have Python installed, open your terminal in the project root and run:
```bash
# Python 3.x
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 📝 Registration Form Details and Functionality

The registration form is housed inside a full-screen accessible modal (`#register-overlay`) and structured into **4 sequential steps**:

| Step | Title | Fields Included | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Step 1** | **Personal Information** | Full Name, Date of Birth, Gender, CNIC Number, Father/Guardian Name | Name $\ge$ 2 chars, DOB required, Gender selected, CNIC exactly 13 digits (auto-formatted), Father name $\ge$ 2 chars |
| **Step 2** | **Contact Information** | Address, Email Address, Phone Number, Guardian Number (Optional) | Address $\ge$ 5 chars, valid email regex, Phone 9–15 digits, Guardian Phone 9–15 digits if provided |
| **Step 3** | **Course Details** | Course, Teacher Name, Campus, Obtained Marks | Course & Campus select required, Teacher name required, Obtained marks $\ge$ 0 |
| **Step 4** | **About You** | About You (Textarea) | Minimum 10 characters introducing interests and goals |

### Form Behaviors
- **Step Validation:** Users cannot advance to the next step without passing validation for the active step. First invalid input is focused and scrolled into view.
- **Data Persistence:** Form field values are preserved when navigating between `Previous` and `Next`.
- **Keyboard Navigation:** Escape key closes open modals; form supports keyboard focus management.
- **Submission:** On final submission, all steps are verified and the dedicated **Success Confirmation Modal** is opened.

---

## 📱 Responsive Design and Theme Toggle

### Responsive Layout
The stylesheet utilizes a **mobile-first** approach with targeted media query breakpoints:
- **Small Mobile (320px – 375px):** Single-column stacked cards, compact emblem, full-width touch buttons, zero horizontal overflow.
- **Standard Mobile (376px – 430px):** Proportional hero emblem, fluid spacing, full-width form inputs, touch targets $\ge$ 44px.
- **Tablets (600px – 860px):** 2-column card grids, centered hero graphics, slide-down mobile navigation drawer.
- **Desktops (861px+):** Full multi-column grid, horizontal navigation bar, expanded layouts.

### Light & Dark Theme
- Toggle between light and dark themes using the sun/moon button in the header.
- Themes are applied via `data-theme="light"` and `data-theme="dark"` on `<html>`.
- Saved preferences persist across sessions in `localStorage` under the key `bano-qabil-theme`.

---

## 🔮 Future Improvements

- **Backend API Integration:** Connect the registration form submission to a backend service / database for persistent application storage.
- **Email Notifications:** Trigger automated confirmation emails to applicants upon form submission.
- **File / Resume Upload:** Add an optional resume/CV upload field in Step 4.
- **Multilingual Support:** Add language switching (English / Urdu) for broader community reach.

---

## 📄 License

This project is maintained for the **Bano Qabil Incubation Center Internship Program**. All rights reserved.
