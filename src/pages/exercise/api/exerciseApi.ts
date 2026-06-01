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
  WeeklyWeightStatsResponse,
} from '../types/exerciseTypes';

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

export const getExercises = async (): Promise<ExerciseResponse[]> => {
  const { data } = await axiosInstance.get<ExerciseResponse[]>('/api/exercise');
  return data;
};

export const getExercise = async (exerciseRecordId: number): Promise<ExerciseResponse> => {
  const { data } = await axiosInstance.get<ExerciseResponse>(`/api/exercise/${exerciseRecordId}`);
  return data;
};

export const updateExercise = async (exerciseRecordId: number, request: ExerciseRequest): Promise<ExerciseResponse> => {
  const { data } = await axiosInstance.put<ExerciseResponse>(`/api/exercise/${exerciseRecordId}`, request);
  return data;
};

export const deleteExercise = async (exerciseRecordId: number): Promise<void> => {
  await axiosInstance.delete(`/api/exercise/${exerciseRecordId}`);
};

export const deleteMealRecord = async (mealRecordId: number): Promise<void> => {
  await axiosInstance.delete(`/api/exercise/meal/${mealRecordId}`);
};

export const getRecentWeights = async (): Promise<WeightResponse[]> => {
  const { data } = await axiosInstance.get<WeightResponse[]>('/api/exercise/weight');
  return data;
};

export const deleteWeight = async (weightRecordId: number): Promise<void> => {
  await axiosInstance.delete(`/api/exercise/weight/${weightRecordId}`);
};

export const getWeeklyWeightMetrics = async (): Promise<WeeklyWeightStatsResponse[]> => {
  const { data } = await axiosInstance.get<WeeklyWeightStatsResponse[]>('/api/exercise/recent-week');
  return data;
};

