import { useQuery } from "@tanstack/react-query";

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  description: string | null;
  client: string | null;
  main_image_url: string | null;
  category_id: string;
  service_id?: string | null;
  created_at: string;
  updated_at: string;
  portfolio_categories: {
    name: string;
    slug: string;
  };
  services?: {
    title: string;
    slug: string;
  } | null;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PortfolioImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export const useAdminPortfolioProjects = () => {
  return useQuery({
    queryKey: ["admin-portfolio-projects"],
    queryFn: async (): Promise<PortfolioProject[]> => {
      console.warn("Portfolio projects query disabled - tables don't exist");
      return [];
    },
  });
};

export const useAdminPortfolioCategories = () => {
  return useQuery({
    queryKey: ["admin-portfolio-categories"],
    queryFn: async (): Promise<PortfolioCategory[]> => {
      console.warn("Portfolio categories query disabled - tables don't exist");
      return [];
    },
  });
};

export const usePortfolioImages = (projectId: string) => {
  return useQuery({
    queryKey: ["portfolio-images", projectId],
    queryFn: async (): Promise<PortfolioImage[]> => {
      console.warn("Portfolio images query disabled - tables don't exist");
      return [];
    },
    enabled: !!projectId,
  });
};