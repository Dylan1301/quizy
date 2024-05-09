/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/me/info": {
    get: operations["read_teacher_me_info_get"];
  };
  "/signup": {
    post: operations["register_teacher_signup_post"];
  };
  "/me/password": {
    patch: operations["change_teacher_password_me_password_patch"];
  };
  "/login/token": {
    post: operations["login_for_access_token_login_token_post"];
  };
  "/login": {
    post: operations["login_login_post"];
  };
  "/room": {
    /** Create room if the teacher has sign in */
    post: operations["room_create_room_post"];
  };
  "/room/list": {
    get: operations["room_list_room_list_get"];
  };
  "/room/{room_id}": {
    /** For teacher getting room detail */
    get: operations["room_detail_room__room_id__get"];
    /** Edit a room information */
    put: operations["room_edit_room__room_id__put"];
    /** Delete a room based on room_id */
    delete: operations["room_delete_room__room_id__delete"];
  };
  "/room/student/{room_id}": {
    /** For student getting room detail */
    get: operations["student_room_detail_room_student__room_id__get"];
  };
  "/room/{room_id}/public": {
    /** For public/non login user to get room information. Only work if room is published */
    get: operations["room_public_detail_room__room_id__public_get"];
  };
  "/room/{room_id}/publish": {
    /** Publish the room if user is room owner. */
    post: operations["room_publish_room__room_id__publish_post"];
  };
  "/room/{room_id}/end": {
    /** End the room if user is room owner */
    post: operations["room_end_room__room_id__end_post"];
  };
  "/quizzes": {
    /**
     * Get all quiz related to the current teacher
     * Return: list of quizzes that created by the current user
     */
    get: operations["get_all_quiz_quizzes_get"];
  };
  "/quiz": {
    /**
     * Create a quiz
     * Param: quiz_in: QuizCreate Object contain information needed to create a quiz
     * Return:  quiz with information
     */
    post: operations["create_quiz_id_quiz_post"];
  };
  "/quiz/{quiz_id}": {
    /**
     * Get a quiz by it ID
     * Param: quiz_id: id of quiz
     * Return:  QuizQuestions object - contain quiz and related questions information.
     */
    get: operations["get_quiz_questions_quiz__quiz_id__get"];
    patch: operations["update_quiz_questions_quiz__quiz_id__patch"];
  };
  "/quiz_ver2": {
    /**
     * Create a quiz with list of questions and answers. This is an another version of quiz
     * Param: quiz_in: QuizCreate Object contain information needed to create a quiz
     * Return:  quiz with questions and answers
     */
    post: operations["create_quiz_questions_api_quiz_ver2_post"];
  };
  "/quiz/{quiz_id}/questions": {
    get: operations["get_questions_api_quiz__quiz_id__questions_get"];
  };
  "/room/{room_id}/info": {
    /**
     * Return QuizzesSession  - Quiz contain list of quiz in different
     * Params:
     *     session: SQL session
     *     student_in: Student information => To ensure student is already in the room
     */
    get: operations["get_room_info_room__room_id__info_get"];
  };
  "/room/{room_id}/quiz": {
    /**
     * Return QuizzesSession  - Quiz contain list of quiz in different
     * Params:
     *     session: SQL session
     *     student_in: Student information => To ensure student is already in the room
     */
    get: operations["get_room_quiz_room__room_id__quiz_get"];
  };
  "/room/{room_id}/start_quiz": {
    /**
     * Return: RoomSession - Room info with the random questions list
     * Params:
     *     session: SQL session
     *     Teacher: Teacher info. To ensure teacher is room owner
     */
    post: operations["start_room_quiz_room__room_id__start_quiz_post"];
  };
  "/room/{room_id}/next_question": {
    /** Teacher move to next question */
    post: operations["start_next_ques_room__room_id__next_question_post"];
  };
  "/room/{room_id}/end_session": {
    /**
     * Not Implemented yet
     * End the current room session and return statistics of all user
     */
    post: operations["end_room_quiz_room__room_id__end_session_post"];
  };
  "/room/{room_id}/answer": {
    /**
     * Create QuestionResponse for student
     *
     * Return: QuestionResponsePublic models
     */
    post: operations["submit_question_response_room__room_id__answer_post"];
  };
  "/room/{room_id}/join": {
    /** Student join room */
    post: operations["student_join_room_room__room_id__join_post"];
  };
  "/room/{room_id}/students": {
    /** Get all students for room if room is open */
    get: operations["get_room_students_room__room_id__students_get"];
  };
  "/room/{room_id}/stats": {
    /**
     * Not Implemented yet
     * Get statistics for the whole group
     */
    get: operations["get_room_stats_room__room_id__stats_get"];
  };
  "/startup": {
    get: operations["startup_event_2_startup_get"];
  };
}

export interface components {
  schemas: {
    /** Answer */
    Answer: {
      /** Content */
      content: string;
      /** Is Correct */
      is_correct: boolean;
      /** Id */
      id?: Partial<number> & Partial<unknown>;
      /** Question Id */
      question_id?: Partial<number> & Partial<unknown>;
      /** Created At */
      created_at?: Partial<string> & Partial<unknown>;
      /** Updated At */
      updated_at?: Partial<string> & Partial<unknown>;
    };
    /** AnswerCreate */
    AnswerCreate: {
      /** Content */
      content: string;
      /** Is Correct */
      is_correct: boolean;
    };
    /** Body_login_for_access_token_login_token_post */
    Body_login_for_access_token_login_token_post: {
      /** Grant Type */
      grant_type?: Partial<string> & Partial<unknown>;
      /** Username */
      username: string;
      /** Password */
      password: string;
      /**
       * Scope
       * @default
       */
      scope?: string;
      /** Client Id */
      client_id?: Partial<string> & Partial<unknown>;
      /** Client Secret */
      client_secret?: Partial<string> & Partial<unknown>;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** LoaderQuestionData */
    LoaderQuestionData: {
      /** Tilte */
      tilte: string;
      /** Explaination */
      explaination: string;
      /** Type */
      type: Partial<string> & Partial<unknown>;
      /** Time Limit */
      time_limit: Partial<number> & Partial<unknown>;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Answers */
      answers: components["schemas"]["Answer"][];
      /** Time Start */
      time_start?: Partial<string> & Partial<unknown>;
    };
    /** LoaderQuizData */
    LoaderQuizData: {
      /** Tilte */
      tilte: string;
      /** Description */
      description: string;
      /** Id */
      id: number;
      /** Teacher Id */
      teacher_id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Questions */
      questions: components["schemas"]["LoaderQuestionData"][];
    };
    /** QuestionAnswer */
    QuestionAnswer: {
      /** Tilte */
      tilte: string;
      /** Explaination */
      explaination: string;
      /** Type */
      type: Partial<string> & Partial<unknown>;
      /** Time Limit */
      time_limit: Partial<number> & Partial<unknown>;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Answers */
      answers: components["schemas"]["Answer"][];
    };
    /** QuestionAnswerCreate */
    QuestionAnswerCreate: {
      /** Tilte */
      tilte: string;
      /** Explaination */
      explaination: string;
      /** Type */
      type: Partial<string> & Partial<unknown>;
      /** Time Limit */
      time_limit: Partial<number> & Partial<unknown>;
      /** Answers */
      answers: components["schemas"]["AnswerCreate"][];
    };
    /** QuestionPublic */
    QuestionPublic: {
      /** Tilte */
      tilte: string;
      /** Explaination */
      explaination: string;
      /** Type */
      type: Partial<string> & Partial<unknown>;
      /** Time Limit */
      time_limit: Partial<number> & Partial<unknown>;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
    };
    /** QuestionReponsePublic */
    QuestionReponsePublic: {
      /** Student Id */
      student_id: number;
      /** Room Id */
      room_id: number;
      /** Question Id */
      question_id: number;
      /** Answer Id */
      answer_id: number;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /** Total Time Taken */
      total_time_taken: number;
    };
    /** QuestionResponseCreate */
    QuestionResponseCreate: {
      /** Student Id */
      student_id: number;
      /** Room Id */
      room_id: number;
      /** Question Id */
      question_id: number;
      /** Answer Id */
      answer_id: number;
    };
    /** QuestionsPublic */
    QuestionsPublic: {
      /** Data */
      data: components["schemas"]["QuestionPublic"][];
    };
    /** QuizCreate */
    QuizCreate: {
      /** Tilte */
      tilte: string;
      /** Description */
      description: string;
    };
    /** QuizPublic */
    QuizPublic: {
      /** Tilte */
      tilte: string;
      /** Description */
      description: string;
      /** Id */
      id: number;
      /** Teacher Id */
      teacher_id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
    };
    /** QuizQuestions */
    QuizQuestions: {
      /** Tilte */
      tilte: string;
      /** Description */
      description: string;
      /** Id */
      id: number;
      /** Teacher Id */
      teacher_id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Questions */
      questions: components["schemas"]["QuestionAnswer"][];
    };
    /** QuizQuestionsCreate */
    QuizQuestionsCreate: {
      /** Tilte */
      tilte: string;
      /** Description */
      description: string;
      /** Questions */
      questions: components["schemas"]["QuestionAnswerCreate"][];
    };
    /** QuizzesPublic */
    QuizzesPublic: {
      /** Data */
      data: components["schemas"]["QuizPublic"][];
    };
    /** Room */
    Room: {
      /** Quiz Id */
      quiz_id?: number;
      /** Name */
      name: string;
      /** Is Randomized */
      is_randomized: boolean;
      /** Is Published */
      is_published: boolean;
      /** Id */
      id?: Partial<number> & Partial<unknown>;
      /** Created At */
      created_at?: Partial<string> & Partial<unknown>;
      /** Updated At */
      updated_at?: Partial<string> & Partial<unknown>;
      /** Ended At */
      ended_at?: Partial<string> & Partial<unknown>;
    };
    /** RoomCreate */
    RoomCreate: {
      /** Quiz Id */
      quiz_id: number;
      /** Name */
      name: string;
      /** Is Randomized */
      is_randomized: boolean;
      /**
       * Is Published
       * @default false
       */
      is_published?: boolean;
    };
    /** RoomList */
    RoomList: {
      /** Data */
      data: components["schemas"]["Room"][];
    };
    /** RoomPublic */
    RoomPublic: {
      /** Quiz Id */
      quiz_id: number;
      /** Name */
      name: string;
      /** Is Randomized */
      is_randomized: boolean;
      /**
       * Is Published
       * @default false
       */
      is_published?: boolean;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Ended At */
      ended_at: Partial<string> & Partial<unknown>;
    };
    /** RoomUpdate */
    RoomUpdate: {
      /** Name */
      name: Partial<string> & Partial<unknown>;
      /** Is Randomized */
      is_randomized: Partial<boolean> & Partial<unknown>;
      /** Is Published */
      is_published: Partial<boolean> & Partial<unknown>;
    };
    /** RoomWithQuiz */
    RoomWithQuiz: {
      /** Quiz Id */
      quiz_id: number;
      /** Name */
      name: string;
      /** Is Randomized */
      is_randomized: boolean;
      /**
       * Is Published
       * @default false
       */
      is_published?: boolean;
      /** Id */
      id: number;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Ended At */
      ended_at: Partial<string> & Partial<unknown>;
      quiz: components["schemas"]["QuizQuestions"];
    };
    /** Student */
    Student: {
      /** Room Id */
      room_id?: Partial<number> & Partial<unknown>;
      /** Name */
      name: string;
      /** Id */
      id?: number;
      /** Created At */
      created_at?: Partial<string> & Partial<unknown>;
    };
    /** StudentList */
    StudentList: {
      /** Data */
      data: components["schemas"]["Student"][];
    };
    /** StudentPublic */
    StudentPublic: {
      /** Room Id */
      room_id: number;
      /** Name */
      name: string;
      /** Id */
      id: number;
    };
    /** StudentRegister */
    StudentRegister: {
      /** Room Id */
      room_id: number;
      /** Name */
      name: string;
    };
    /** TeacherCreate */
    TeacherCreate: {
      /** Email */
      email: string;
      /** Name */
      name: string;
      /** Google Id */
      google_id?: Partial<string> & Partial<unknown>;
      /** Password */
      password: string;
    };
    /** TeacherLogin */
    TeacherLogin: {
      /** Email */
      email: string;
      /** Password */
      password: string;
    };
    /** TeacherPassword */
    TeacherPassword: {
      /** Current Password */
      current_password: string;
      /** New Password */
      new_password: string;
    };
    /** TeacherPublic */
    TeacherPublic: {
      /** Email */
      email: string;
      /** Name */
      name: string;
      /** Google Id */
      google_id?: Partial<string> & Partial<unknown>;
      /** Id */
      id: number;
    };
    /** Token */
    Token: {
      /** Access Token */
      access_token: string;
      /**
       * Token Type
       * @default bearer
       */
      token_type?: string;
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (Partial<string> & Partial<number>)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
}

export interface operations {
  read_teacher_me_info_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["TeacherPublic"];
        };
      };
    };
  };
  register_teacher_signup_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["TeacherPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TeacherCreate"];
      };
    };
  };
  change_teacher_password_me_password_patch: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TeacherPassword"];
      };
    };
  };
  login_for_access_token_login_token_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Token"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/x-www-form-urlencoded": components["schemas"]["Body_login_for_access_token_login_token_post"];
      };
    };
  };
  login_login_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Token"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TeacherLogin"];
      };
    };
  };
  /** Create room if the teacher has sign in */
  room_create_room_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Room"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RoomCreate"];
      };
    };
  };
  room_list_room_list_get: {
    parameters: {
      query: {
        quiz_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RoomList"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** For teacher getting room detail */
  room_detail_room__room_id__get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Room"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Edit a room information */
  room_edit_room__room_id__put: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Room"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RoomUpdate"];
      };
    };
  };
  /** Delete a room based on room_id */
  room_delete_room__room_id__delete: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** For student getting room detail */
  student_room_detail_room_student__room_id__get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RoomWithQuiz"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** For public/non login user to get room information. Only work if room is published */
  room_public_detail_room__room_id__public_get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RoomPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Publish the room if user is room owner. */
  room_publish_room__room_id__publish_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RoomCreate"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** End the room if user is room owner */
  room_end_room__room_id__end_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RoomPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Get all quiz related to the current teacher
   * Return: list of quizzes that created by the current user
   */
  get_all_quiz_quizzes_get: {
    parameters: {
      query: {
        skip?: number;
        limit?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuizzesPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Create a quiz
   * Param: quiz_in: QuizCreate Object contain information needed to create a quiz
   * Return:  quiz with information
   */
  create_quiz_id_quiz_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuizPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["QuizCreate"];
      };
    };
  };
  /**
   * Get a quiz by it ID
   * Param: quiz_id: id of quiz
   * Return:  QuizQuestions object - contain quiz and related questions information.
   */
  get_quiz_questions_quiz__quiz_id__get: {
    parameters: {
      path: {
        quiz_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuizQuestions"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_quiz_questions_quiz__quiz_id__patch: {
    parameters: {
      path: {
        quiz_id: unknown;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuizQuestions"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Create a quiz with list of questions and answers. This is an another version of quiz
   * Param: quiz_in: QuizCreate Object contain information needed to create a quiz
   * Return:  quiz with questions and answers
   */
  create_quiz_questions_api_quiz_ver2_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuizQuestions"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["QuizQuestionsCreate"];
      };
    };
  };
  get_questions_api_quiz__quiz_id__questions_get: {
    parameters: {
      path: {
        quiz_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuestionsPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Return QuizzesSession  - Quiz contain list of quiz in different
   * Params:
   *     session: SQL session
   *     student_in: Student information => To ensure student is already in the room
   */
  get_room_info_room__room_id__info_get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["LoaderQuizData"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Return QuizzesSession  - Quiz contain list of quiz in different
   * Params:
   *     session: SQL session
   *     student_in: Student information => To ensure student is already in the room
   */
  get_room_quiz_room__room_id__quiz_get: {
    parameters: {
      path: {
        room_id: number;
      };
      header: {
        "student-id": Partial<number> & Partial<unknown>;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Return: RoomSession - Room info with the random questions list
   * Params:
   *     session: SQL session
   *     Teacher: Teacher info. To ensure teacher is room owner
   */
  start_room_quiz_room__room_id__start_quiz_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["LoaderQuizData"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Teacher move to next question */
  start_next_ques_room__room_id__next_question_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Not Implemented yet
   * End the current room session and return statistics of all user
   */
  end_room_quiz_room__room_id__end_session_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Create QuestionResponse for student
   *
   * Return: QuestionResponsePublic models
   */
  submit_question_response_room__room_id__answer_post: {
    parameters: {
      path: {
        room_id: number;
      };
      header: {
        "student-id": Partial<number> & Partial<unknown>;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["QuestionReponsePublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["QuestionResponseCreate"];
      };
    };
  };
  /** Student join room */
  student_join_room_room__room_id__join_post: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["StudentPublic"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["StudentRegister"];
      };
    };
  };
  /** Get all students for room if room is open */
  get_room_students_room__room_id__students_get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["StudentList"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Not Implemented yet
   * Get statistics for the whole group
   */
  get_room_stats_room__room_id__stats_get: {
    parameters: {
      path: {
        room_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["StudentPublic"];
      };
    };
  };
  startup_event_2_startup_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
}

export interface external {}
