from typing import TYPE_CHECKING, List
from faker import Faker
from sqlmodel import Session, create_engine, select
from core.db.question import create_question_response, get_question_answer
from core.db.quiz import create_quiz_questions
from core.db.room import create_room

from models.room import RoomCreate
from models.answer import AnswerCreate
from models.question import Question, QuestionAnswerCreate, QuestionResponseCreate
from models.quiz import QuizCreate, QuizQuestionsCreate, Quiz
from models.user import Student, StudentRegister, User, TeacherCreate, Teacher
from core.db.db import create_student, create_teacher
import csv
import json
import random

# This file will use to generate fake data for testing
# generate data for user table using SQLModel and Faker

# create a Faker instance
fake = Faker()

# Use the hostname "db" to connect to the PostgreSQL Docker container
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)

# Keep for refferences
# generate fake data for user table
# with Session(engine) as session:
#     for _ in range(100):  # generate 100 fake users
#         fake_user = User(
#             username=fake.name(),
#             email=fake.email(),
#             hashed_password=fake.password(),
#             # add more fields if your User model has more
#         )
#         session.add(fake_user)
#     session.commit()


def create_teacher_seed(engine, loop_times: int = 100):
    """
    Create teacher sample data into db
    Output teacher_input.csv file => Check for username and password
    Output teacher_output.csv file => Same data as put in the db

    """
    teacher_list = []
    teacher_output = []
    with Session(engine) as session:
        for _ in range(loop_times):
            teacher = TeacherCreate(
                email=fake.email(), name=fake.name(), password=fake.password())
            teacher_list.append(teacher.model_dump_json())
            teacher_out = create_teacher(
                session=session, teacher_create=teacher)
            teacher_output.append(teacher_out.model_dump_json())
    list_to_csv(teacher_list, "teacher_input.csv")
    list_to_csv(teacher_output, "teacher_output.csv")


def list_to_csv(json_list, csv_filename):
    # Assuming data is a list of lists
    data_dicts = [json.loads(json_str) for json_str in json_list]

    # Get the headers from the first dictionary
    headers = data_dicts[0].keys()

    # Write to CSV file
    with open(csv_filename, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for data_dict in data_dicts:
            writer.writerow(data_dict)
    print("Successful written data to file {}".format(csv_filename))


def create_quiz_seed(enigne, quiz_per_teacher= 3, ques_per_quiz=5, answer_per_ques=4):
    """
    Create Quiz - Question - Answers for teacher in database

    """
    def generate_question_object(ques_per_quiz=ques_per_quiz, answer_per_ques=answer_per_ques):
        question_list = []
        for _ in range(ques_per_quiz):
            answer_list = [AnswerCreate(content=fake.word(), is_correct=(
                i == 0)) for i in range(answer_per_ques)]
            question_create = QuestionAnswerCreate(tilte=fake.text(max_nb_chars=10), explaination=fake.text(
                max_nb_chars=30), type="MultipleChoice", time_limit=10, answers=answer_list)
            question_list.append(question_create)
        return question_list

    with Session(engine) as session:
        teacher_id_list = session.exec(select(Teacher.id)).all()
        for teacher_id in teacher_id_list:
            for i in range(quiz_per_teacher):
                question_list = generate_question_object(
                    ques_per_quiz, answer_per_ques)
                quiz_create = QuizQuestionsCreate(tilte=fake.text(max_nb_chars=10),
                                                  description=fake.text(max_nb_chars=100), questions=question_list
                                                  )
                create_quiz_questions(
                    session=session, teacher_id=teacher_id, quiz_in=quiz_create)


def create_room_seed(session, quiz_id, room_per_quiz= random.randint(1,2)):
    room_list = []
    for i in range(room_per_quiz):
        room_in = RoomCreate(
            quiz_id=quiz_id,
            name=fake.text(10),
            is_published=(random.choice([True, False]))
        )
        room_list.append(create_room(session=session, room_in=room_in))
    return room_list
    

def create_student_seed(session, room_id,student_per_room=random.randint(5,10)) -> List[Student]:
    student_list = []
    for i in range(student_per_room):
        student_in = StudentRegister(room_id=room_id, name=fake.name())

        student_list.append(create_student(session=session, student_in=student_in))
    return student_list

def create_question_response_seed(session, student_id, room_id, question_id, answer_id):
    question_response_in = QuestionResponseCreate(student_id=student_id, room_id=room_id, question_id=question_id, answer_id=answer_id)
    create_question_response(session=session, question_response_in=question_response_in, total_time=random.randint(1,1000))


def create_room_student_quesres(engine):
    with Session(engine) as session:
        statement = (select(Quiz))
        quiz_list = session.exec(statement).all()
        for quiz in quiz_list:
            room_list = create_room_seed(session=session , quiz_id= quiz.id)
            question_list = [get_question_answer(session=session, question_id=x.id) for x in quiz.questions]
            for room in room_list:
                student_list = create_student_seed(session=session, room_id=room.id)
                for stu in student_list:
                    for ques in question_list:
                        ans_id = random.choice(ques.answers).id
                        create_question_response_seed(session, student_id=stu.id, room_id=room.id, question_id=ques.id, answer_id=ans_id)

create_teacher_seed(engine, loop_times=20)
create_quiz_seed(engine, quiz_per_teacher=3)
create_room_student_quesres(engine)
