export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  telegram: string;
}

export interface Profile {
  name: string;
  initials: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phoneDisplay: string;
  phoneE164: string;
  location: string;
  photo: string;
  resumeUrl: string;
  socials: SocialLinks;
  education: {
    institution: string;
    degree: string;
    year: string;
  };
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface EmploymentExperience {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  summary: string;
}

export interface ProjectLink {
  label: "Repo" | "Live";
  url: string;
}

export type ProjectCategory = "work" | "personal";

export interface Project {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  tech: string[];
  links: ProjectLink[];
  category: ProjectCategory;
}
