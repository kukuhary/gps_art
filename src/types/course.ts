export type ShapeCategory = '전체' | '동물' | '하트·심볼' | '해양생물' | '캐릭터·기타';

export type RegionCategory = '전체' | '서울' | '대전·충청' | '부산·경남' | '제주·기타';

export type Difficulty = '쉬움' | '보통' | '도전';

export interface ArtDecoration {
  id: string;
  type: 'eye' | 'nose' | 'blush' | 'ear' | 'whisker' | 'sparkle' | 'label';
  position: [number, number]; // [lat, lng]
  scale?: number;
  rotation?: number;
  color?: string;
  text?: string;
}

export interface CourseWaypoint {
  index: number; // index in coordinates array
  title: string;
  description: string;
}

export interface GpsArtCourse {
  id: string;
  title: string;
  subtitle: string;
  region: Exclude<RegionCategory, '전체'>;
  district: string;
  shapeCategory: Exclude<ShapeCategory, '전체'>;
  shapeName: string; // e.g. "강아지", "고양이", "하트", "고래"
  distanceKm: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  startPointName: string;
  nearestStation: string;
  accentColor: string; // Vibrant gallery accent color
  secondaryColor: string;
  description: string;
  tags: string[];
  likes: number;
  isUserCreated?: boolean;
  createdAt: string;
  center: [number, number];
  zoom: number;
  coordinates: [number, number][]; // [lat, lng][]
  decorations: ArtDecoration[];
  waypoints: CourseWaypoint[];
}
