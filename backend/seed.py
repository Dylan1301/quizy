from typing import TYPE_CHECKING
from faker import Faker
from sqlmodel import Session, create_engine, select
from core.db.quiz import create_quiz_questions
from models.answer import AnswerCreate
from models.question import Question, QuestionAnswerCreate
from models.quiz import QuizCreate, QuizQuestionsCreate
from models.user import User, TeacherCreate, Teacher
from core.db.db import create_teacher
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


def create_quiz_seed(enigne, quiz_per_teacher: int = random.randint(2, 5), ques_per_quiz=4, answer_per_ques=2):
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
            for _ in range(quiz_per_teacher):
                question_list = generate_question_object(
                    ques_per_quiz, answer_per_ques)
                quiz_create = QuizQuestionsCreate(tilte=fake.text(max_nb_chars=10),
                                                  description=fake.text(max_nb_chars=100), questions=question_list
                                                  )
            create_quiz_questions(
                session=session, teacher_id=teacher_id, quiz_in=quiz_create)


create_teacher_seed(engine, loop_times=50)
create_quiz_seed(engine)
