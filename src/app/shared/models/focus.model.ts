export interface FocusItem {
  id: string;
  title: string;
  description: string;
  type: 'ngo' | 'firm' | 'city' | 'innovation' | 'course';
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  imageUrl: string;
  website?: string;
  location?: string;
  founded?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
  actions?: string[];
  featured?: boolean;
  content?: string;
}

export interface FocusFilter {
  type?: string;
  element?: string;
  featured?: boolean;
}
