// Absolute (`/#id`) so the links resolve to the homepage sections from any
// route, including the project detail pages under /projects/[slug].
export const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
] as const;
