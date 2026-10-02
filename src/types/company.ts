export interface CompanySocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  dribbble?: string;
}

export interface Company {
  idCompany: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  industry: string;
  idLocation: string;
  country: string;
  website: string;
  founded: number;
  verified: boolean;
  socialLinks?: CompanySocialLinks;
  jobIds: string[];
}
