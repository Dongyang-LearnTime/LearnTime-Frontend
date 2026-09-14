export type NotificationReferenceType =
    | "FRIEND_REQUEST" // 친구 요청
    | "STUDY_INVITATION" // 스터디 초대
    | "STUDY_JOIN_REQUEST" // 스터디 가입 요청
    | "CALENDAR_RECORD"; // 캘린더 기록

export type NotificationType =
    | "FRIEND_REQUEST_RECEIVED" // 친구 요청 수신
    | "FRIEND_REQUEST_ACCEPTED" // 친구 요청 수락
    | "FRIEND_REQUEST_REJECTED" // 친구 요청 거절
    | "CALENDAR_REMINDER" // 캘린더 리마인더
    | "STUDY_INVITATION_RECEIVED" // 스터디 초대 수신
    | "STUDY_INVITATION_ACCEPTED" // 스터디 초대 수락
    | "STUDY_INVITATION_REJECTED" // 스터디 초대 거절
    | "STUDY_JOIN_REQUEST_RECEIVED" // 스터디 가입 요청 수신 (방장)
    | "STUDY_JOIN_REQUEST_APPROVED" // 스터디 가입 요청 승인 (요청자)
    | "STUDY_JOIN_REQUEST_REJECTED" // 스터디 가입 요청 거절 (요청자)
    | "MESSAGE_RECEIVED"; // 쪽지 수신



export type ReminderStatus =
    | "WAITING" // 아직 발송 안됨
    | "SENT" // 정상 발송
    | "CANCEL"; // 발송 취소