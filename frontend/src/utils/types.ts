export type Id = number;

export interface RoomStudent {
  id: number;
  name: string;
  icon: string;
}

export interface FirebaseRoomInfo {
  questionOrder: Id[];
  students: {
    [key: Id]: RoomStudent;
  };
  questions: {
    [key: Id]: {
      correctAnswerId: Id;
      answers: {
        [key: Id]: {
          count: number;
          studentIds: Id[];
        };
      };
    };
  };
}
