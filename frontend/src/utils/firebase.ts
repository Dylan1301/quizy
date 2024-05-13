import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { firebaseFirestore } from "./constants";
import { FirebaseRoomInfo } from "./types";
import { QuestionAnswer } from "../api/model";

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

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
    publish: async function (questions: QuestionAnswer[]) {
      const info: FirebaseRoomInfo = {
        status: "published",
        questionOrder: shuffle(questions.map((q) => q.id)),
        activeQuestionIndex: -1,
        questions: questions.reduce(
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
      info.status = "started";
      info.activeQuestionIndex = 0;
      return this.set(info);
    },
    join: async function (id: number, name: string, icon: string) {
      const info = await this.get();
      console.log(info);
      
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
      if (answer.studentIds.includes(studentId)) return;
      info.questions[questionId].answers[answerId] = {
        count: answer.count + 1,
        studentIds: [...answer.studentIds, studentId],
      };
      return this.set(info);
    },
    nextQuestion: async function () {
      const info = await this.get();
      if (!info) throw new Error("Room has not been started yet");
      info.activeQuestionIndex++;
      return this.set(info);
    },
    end: async function () {
      const info = await this.get();
      if (!info) throw new Error("Room has not been started yet");
      info.status = "ended";
      return this.set(info);
    },
  };
};
