export interface AnalysisItem {
  title: string;
  content: string;
  type: string;
}

export interface AnalysisResponse {
  analysis: AnalysisItem[];
}

export interface YoutubeVideoResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export interface ExerciseRequest {
  bodyParts: string[];
  duration: number;
  content: string;
}

export interface ExerciseResponse {
  id: number;
  bodyParts: string[];
  duration: number;
  content: string;
  calories: number;
  createdAt: string;
}

export interface MealRequest {
  content: string;
}

export interface MealResponse {
  id: number;
  foodName: string;
  calories: number;
  protein: number;
  isEstimated: boolean;
  createdAt: string;
}

export interface WeightRequest {
  weight: number;
  bodyFat: number;
}

export interface WeightResponse {
  id: number;
  weight: number;
  bodyFat: number;
  createdAt: string;
}
