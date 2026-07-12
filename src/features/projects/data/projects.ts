import type { Project } from "@/types";

export const projects: Project[] = [
  // ---- Work experience projects ----
  {
    slug: "lunch-management-admin-dashboard",
    title: "Lunch Management Admin Dashboard",
    description:
      "A full-featured admin web application built with Next.js 16, React 19, TypeScript, and Material-UI for managing organization-wide employee meal services (both lunch and breakfast).",
    highlights: [
      "Built a dashboard with real-time meal order statistics visualized through Bar, Pie, and Line charts using MUI X Charts",
      "Developed lunch and breakfast menu/dish management modules, including image upload, starred items, and dish history tracking",
      "Implemented employee management with search, pagination, and block/unblock functionality",
      "Built a four-stage complaint management workflow (New, Replied, Solved, Archived) with date and status filtering",
      "Implemented a QR code generation and scanning system for meal verification",
      "Handled authentication and route protection using NextAuth.js with JWT and Next.js middleware",
      "Managed global state with Zustand and forms with React Hook Form, integrated with a centralized Axios service layer and downloadable reports",
    ],
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Material-UI (MUI)",
      "MUI X Charts",
      "Zustand",
      "React Hook Form",
      "NextAuth.js",
      "Axios",
      "Day.js",
      "react-qr-code",
    ],
    links: [],
    category: "work",
  },
  {
    slug: "nextextract-api-gateway-user-portal",
    title: "NextExtract – API Gateway User Portal",
    description:
      "The end-user web portal for an API-gateway SaaS platform, built with Next.js 16 (App Router), React 19, and TypeScript, where users browse an API catalog, subscribe, and consume APIs through a credit-metered, encrypted gateway.",
    highlights: [
      "Built the API catalog, detail, and \"try the API\" live console with documentation, schema tables, and multi-language code samples",
      "Developed a 7-route user dashboard (overview, usage, credits, subscriptions, profile, support) with a sidebar shell and Recharts-based usage analytics",
      "Implemented authentication with Auth.js v5 (NextAuth), JWT, and a session-transport seam for refresh tokens",
      "Added multi-language support (English/Bengali) with next-intl and light/dark theming with next-themes",
      "Built forms and validation with React Hook Form and Zod, and the UI with shadcn/ui and Radix UI",
      "Followed a feature-sliced architecture with a strict one-way dependency rule enforced by ESLint, and a single-file native fetch API client",
    ],
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Auth.js (NextAuth v5)",
      "next-intl",
      "next-themes",
      "React Hook Form",
      "Zod",
      "Recharts",
      "Sonner",
    ],
    links: [],
    category: "work",
  },
  {
    slug: "foodi-cartup",
    title: "Foodi & Cartup",
    description:
      "Contributions to two well-known live products in Bangladesh — from admin panel design fixes to new feature delivery.",
    highlights: [
      "Fixed design issues across Cartup's entire admin panel and shipped new features",
      "Worked on the design of Foodi's inventory module",
      "Resolved bugs surfaced in live production releases",
    ],
    tech: ["React", "React pro sidebar", "Next", "Zod", "Shadcn", "Tailwind CSS", "Admin Panel Design"],
    links: [],
    category: "work",
  },
  {
    slug: "e-food-delivery-platform",
    title: "e-Food Delivery Platform",
    description:
      "A food delivery platform built with Nuxt 3 and TypeScript, covering the entire front-end web design.",
    highlights: [
      "Used a service worker to repeatedly refresh the auth token",
      "Authored TypeScript types across the codebase",
      "Dynamically rendered multiple components within a single component",
      "Route navigation with conditional show/hide of content driven by API calls",
      "Built several confirmation modal components",
    ],
    tech: ["Nuxt 3", "TypeScript", "Pinia", "Tailwind CSS", "Axios", "LocalStorage", "Service Worker", "Dynamic Routing"],
    links: [],
    category: "work",
  },
  {
    slug: "foodqo-homepage-ui",
    title: "SaaS (RMS) Product FoodQo Homepage UI",
    description:
      "The homepage for FoodQo, a restaurant management SaaS product built on Nuxt 2 (Vue.js).",
    highlights: [
      "Integrated Storyblok CMS so the client can easily edit website content",
      "Implemented Nuxt/i18n for seamless Bengali/English switching",
      "Styled with Tailwind CSS, including an infinite-slider animation",
    ],
    tech: ["Nuxt 2", "Tailwind CSS", "Storyblok CMS", "Nuxt/i18n"],
    links: [{ label: "Live", url: "https://foodqo.com/" }],
    category: "work",
  },

  // ---- Personal projects ----
  {
    slug: "tea-and-tales",
    title: "Tea & TALES",
    description:
      "Tea & TALES is a website built using a free and open-source API, designed for reading books online and downloading various titles.",
    highlights: [
      "The website is structured into three main sections: Navbar, Main Body, and Footer, along with additional pages and dynamic routing capabilities",
      "It includes several pages such as the Home Page, Wish Lists Page, Book Detail Page, and Category-wise Book Listing Page",
      "The Home Page consists of two sections: a carousel and a pagination area below it. The carousel is implemented using the swiper.js package, which has been customized to enhance its visual appeal. Each pagination click loads a new set of book listings",
      "The Wish Lists feature allows users to save their favorite books for easy access later. This is implemented using localStorage, as there is no separate API for it",
      "Each book card includes a heart icon. Clicking the icon adds the book to the Wish List",
      "A category dropdown enables users to browse books based on selected categories",
    ],
    tech: [
      "React.js",
      "React router",
      "Swiper.js",
      "LocalStorage",
      "JavaScript",
      "Vite",
      "Tailwind",
      "Vanilla css",
      "Axios",
    ],
    links: [
      { label: "Repo", url: "https://github.com/SMFaysalHaque/bookStore-react-tailwind/tree/main" },
      { label: "Live", url: "https://book-store-react-tailwind.vercel.app/" },
    ],
    category: "personal",
  },
  {
    slug: "ielts-course",
    title: "IELTS Course",
    description:
      "A responsive, scalable, and feature-rich web application built with Next.js 15, Tailwind CSS, and TypeScript for delivering IELTS course content, media previews, and structured curriculum data to users. This project demonstrates strong front-end architecture and clean integration with external APIs.",
    highlights: [
      "Fully responsive design using Tailwind CSS",
      "Course preview trailer using YouTube integration",
      "Dynamic content rendering from API",
      "SEO-optimized with Next.js",
      "TypeScript for static typing",
      "Linting and formatting using ESLint",
      "PostCSS integration",
    ],
    tech: ["Next.js", "SSR", "SEO", "Axios", "TypeScript", "Tailwind"],
    links: [
      { label: "Repo", url: "https://github.com/SMFaysalHaque/ielts-course" },
      { label: "Live", url: "https://ielts-course-two.vercel.app/" },
    ],
    category: "personal",
  },
  {
    slug: "elegant-living",
    title: "Elegant Living",
    description:
      "This project is built using React, React Router, Context API, and localStorage. It is an online furniture shop where users can browse and purchase their desired furniture.",
    highlights: [
      "Displaying available furniture based on stock quantity",
      "Allowing customers to add products to their cart",
      "Enabling customers to proceed from the cart to the order confirmation page",
    ],
    tech: ["React.js", "Context API", "Tailwind CSS", "Dynamic Routing", "localStorage"],
    links: [
      { label: "Repo", url: "https://github.com/SMFaysalHaque/elegant-living" },
      { label: "Live", url: "https://elegant-living.vercel.app/" },
    ],
    category: "personal",
  },
  {
    slug: "react-context-api-reducer",
    title: "E-commerce (React, ContextApi, Reducer)",
    description:
      "While working with React, I had the opportunity to explore and implement several key concepts, including the Reducer and Context API. This project was developed with a focus on these technologies.",
    highlights: [
      "Data is shared efficiently across multiple components using the Context API",
      "The Reducer is used to manage the logic and functions, resulting in improved code readability and structure",
      "The design is implemented using HTML and Tailwind CSS v4 for a clean and responsive UI",
    ],
    tech: ["React", "Context API", "Reducer", "Tailwind v4", "Vite"],
    links: [
      { label: "Repo", url: "https://github.com/SMFaysalHaque/react-contextApi-reducer" },
      { label: "Live", url: "https://react-context-api-reducer.vercel.app/" },
    ],
    category: "personal",
  },
  {
    slug: "stock-management-rest-api",
    title: "Stock Management REST API (Go + PostgreSQL)",
    description:
      "A RESTful CRUD API for managing stock records (name, price, company), built with Go and PostgreSQL.",
    highlights: [
      "Designed and implemented RESTful endpoints for creating, reading, updating, and deleting stock records",
      "Built a PostgreSQL database connection layer using lib/pq, with environment-based configuration via godotenv",
      "Structured the codebase into modular packages (router, middleware, models) for separation of concerns",
      "Handled JSON request/response encoding and decoding for all API endpoints",
      "Implemented query parameter handling and dynamic routing (e.g., fetch/update/delete by stock ID) using Gorilla Mux",
    ],
    tech: ["Go", "PostgreSQL", "Gorilla Mux", "lib/pq", "godotenv", "RESTful API design"],
    links: [],
    category: "personal",
  },
  {
    slug: "sayburgh-trainers-pages",
    title: "Sayburgh Solutions Trainer's Pages",
    description: "Front end of the \"Training Program\" section on the Sayburgh Solutions website.",
    highlights: [
      "Static trainer data sourced from the Vuex store",
      "Fully static-data driven page — no API required",
    ],
    tech: ["Nuxt 2", "Vuex", "Tailwind CSS", "Dynamic Routing"],
    links: [{ label: "Live", url: "https://sayburgh.com/training" }],
    category: "personal",
  },
];
