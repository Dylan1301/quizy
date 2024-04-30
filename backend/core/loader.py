from pydantic import BaseModel
from sqlalchemy import values
from models.quiz import QuizQuestions
from models.question import QuestionAnswer
from typing import Dict, Optional
from datetime import datetime
from typing import List, Union
import random

class LoaderQuestionData(QuestionAnswer):
    time_start: Optional[datetime] = None
    
    

class LoaderQuizData(QuizQuestions):
    questions: List[LoaderQuestionData]

class QuizLoader:
    data: Dict = dict()

    def __init__(self):
      pass


    def get_data(self, key):
        if key in self.data:
            return self.data[key]
        return None

    def put_data(self, key, value):
        if key not in self.data:
            self.data[key] = value
            return self.data[key]
        return None

    def check_room_id_availble(self, room_id:int):
        return (room_id in self.data)

    def store_room_data(self, room_id: int, quiz_data: LoaderQuizData):
        return self.put_data(room_id, quiz_data)

    def get_room_data(self, room_id: int) -> Union[LoaderQuizData, None]:
        if self.check_room_id_availble(room_id):
            return self.data[room_id]
        return None
    
    def randomnizng_question_list(self, room_id: int):
        if self.check_room_id_availble(room_id):
            quiz_data = self.get_room_data(room_id)
            questions_list = quiz_data.questions
            random.shuffle(questions_list)

            return quiz_data
        return None
    
    def get_question_from_room_quiz(self, room_id:int, question_id: int):
        data = self.get_room_data(room_id)
        if data:
            for ques in data.questions:
                if ques.id == question_id:
                    return ques
            return None
        
        return None

    def update_question_time(self, room_id: int, question_id: int):
        question = self.get_question_from_room_quiz(room_id, question_id)
        if question:
            question.time_start = datetime.now()
            # question.__dict__.update({'time_start': datetime.now()})
        return  self.get_question_from_room_quiz(room_id, question_id)
    

    
    def move_to_next_question(self, room_id: int):
        quiz = self.get_room_data(room_id)
        next_ques = None
        if quiz:
            questions = quiz.questions
            for ques in questions:
                if not ques.time_start:
                    next_ques = ques
                    break
        if next_ques:
            next_ques.time_start = datetime.now()
        return next_ques
    
    def get_next_question(self, room_id: int):
        quiz = self.get_room_data(room_id)
        if quiz:
            next_ques = None
            questions = quiz.questions
            for ques in questions:
                if not ques.time_start:
                    next_ques = ques
                    return next_ques
                
        return None

    