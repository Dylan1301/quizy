export type Id = number;

export interface RoomStudent {
  id: number;
  name: string;
  icon: string;
}

export interface FirebaseRoomInfo {
  status: "published" | "started" | "ended";
  students: {
    [key: Id]: RoomStudent;
  };
  questionOrder: Id[];
  activeQuestionIndex: number;
  questions: {
    [key: Id]: {
      correctedAnswerId: Id;
      answers: {
        [key: Id]: {
          count: number;
          studentIds: Id[];
        };
      };
    };
  };
}
