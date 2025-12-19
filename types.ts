
export type Category = 'AI' | 'Design' | 'Blog' | 'Tool';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
}
