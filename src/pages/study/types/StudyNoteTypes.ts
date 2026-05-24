export interface StudyNotesResponse {
  studyNotesId: number;
  studyId: number;
  studyMemberId?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}


/** 특정 스터디의 필기 목록 조회 */
export interface StudyNoteListItem {
  studyNotesId: number;
  studyId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}