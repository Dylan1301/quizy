from typing import Any, List, Dict, Optional

from sqlmodel import SQLModel

class AnswerEndModel(SQLModel):
    studentIds: List[int]
    count: int
 
    # def __init__(self, student_ids: List[int], count: int) -> None:
    #     self.student_ids = student_ids
    #     self.count = count
 
 
class QuestionEndModel(SQLModel):
    answers: Dict[str, AnswerEndModel]
    correctedAnswerId: int
 
    # def __init__(self, answers: Dict[str, AnswerEndModel], corrected_answer_id: int) -> None:
    #     self.answers = answers
    #     self.corrected_answer_id = corrected_answer_id
 
 
class StudentEndModel(SQLModel):
    id: int
    icon: str
    name: str
 
    # def __init__(self, id: int, icon: str, name: str) -> None:
    #     self.id = id
    #     self.icon = icon
    #     self.name = name
 
 
class EndRoomBody(SQLModel):
    status: str
    questions: Dict[str, QuestionEndModel]
    questionOrder: List[int]
    students: Dict[str, StudentEndModel]
    activeQuestionIndex: int
 
    # def __init__(self, status: str, questions: Dict[str, QuestionEndModel], question_order: List[int], students: Dict[str, StudentEndModel], active_question_index: int) -> None:
    #     self.status = status
    #     self.questions = questions
    #     self.question_order = question_order
    #     self.students = students
    #     self.active_question_index = active_question_index

    
