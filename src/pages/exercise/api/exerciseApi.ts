import { axiosInstance } from '../../../app/apiClient';
import type {
  AnalysisResponse,
  YoutubeVideoResponse,
  ExerciseRequest,
  ExerciseResponse,
  MealRequest,
  MealResponse,
  WeightRequest,
  WeightResponse,
} from '../types/exerciseApi';

export const getWeeklyAnalysis = async (): Promise<AnalysisResponse> => {
  const { data } = await axiosInstance.get<AnalysisResponse>('/api/exercise/analysis/weekly');
  return data;
};

export const getRecommendedVideos = async (bodyParts: string[]): Promise<YoutubeVideoResponse[]> => {
  const { data } = await axiosInstance.get<YoutubeVideoResponse[]>('/api/exercise/videos', {
    params: { bodyParts: bodyParts.join(',') }
  });
  return data;
};

export const saveExercise = async (request: ExerciseRequest): Promise<ExerciseResponse> => {
  const { data } = await axiosInstance.post<ExerciseResponse>('/api/exercise/save', request);
  return data;
};

export const saveMeal = async (request: MealRequest): Promise<MealResponse> => {
  const { data } = await axiosInstance.post<MealResponse>('/api/exercise/meal/save', request);
  return data;
};

export const getTodayMeals = async (): Promise<MealResponse[]> => {
  const { data } = await axiosInstance.get<MealResponse[]>('/api/exercise/meal/today');
  return data;
};

export const saveWeight = async (request: WeightRequest): Promise<WeightResponse> => {
  const { data } = await axiosInstance.post<WeightResponse>('/api/exercise/weight/save', request);
  return data;
};
