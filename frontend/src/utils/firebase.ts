import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { firebaseFirestore } from "./constants";
import { FirebaseRoomInfo } from "./types";
import { LoaderQuizData } from "../api/model";

export const getFirebaseRoomActions = (roomId: number | string) => {
  const roomDoc = doc(firebaseFirestore, "room", `${roomId}`);

  return {
    watch: (callback: (info: FirebaseRoomInfo) => void) => {
      return onSnapshot(roomDoc, (d) => callback(d.data() as FirebaseRoomInfo));
    },
    get: async () => {
      const roomSnap = await getDoc(roomDoc);
      return roomSnap.data() as FirebaseRoomInfo;
    },
    set: async (info: FirebaseRoomInfo) => setDoc(roomDoc, info),
    publish: async function (data: LoaderQuizData) {
      const info: FirebaseRoomInfo = {
        questionOrder: data.questions.map((q) => q.id),
        activeQuestionIndex: -1,
        questions: data.questions.reduce(
          (preQ, curQ) => ({
            ...preQ,
            [curQ.id]: {
              answers: curQ.answers.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.id]: { count: 0, studentIds: [] },
                }),
                {}
              ),
              correctedAnswerId: curQ.answers.find((a) => a.is_correct)?.id,
            },
          }),
          {}
        ),
        students: {},
      };
      return this.set(info);
    },
    start: async function () {
      const info = await this.get();
      if (!info) throw new Error("Room has not been published yet");
      info.activeQuestionIndex = 0;
      return this.set(info);
    },
    join: async function (id: number, name: string, icon: string) {
      const info = await this.get();
      if (!info) throw new Error("Room has not been started yet");
      info.students[id] = { id, name, icon };
      return this.set(info);
    },
    answer: async function ({
      answerId,
      questionId,
      studentId,
    }: {
      questionId: number;
      answerId: number;
      studentId: number;
    }) {
      const info = await this.get();
      if (!info) throw new Error("Room has not been started yet");
      const answer = info.questions[questionId].answers[answerId];
      info.questions[questionId].answers[answerId] = {
        count: answer.count + 1,
        studentIds: [...answer.studentIds, studentId],
      };
      return this.set(info);
    },
  };
};
