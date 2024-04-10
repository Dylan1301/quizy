from faker import Faker
from sqlmodel import Session, create_engine
from models.user import User

# This file will use to generate fake data for testing
# generate data for user table using SQLModel and Faker

# create a Faker instance
fake = Faker()

# Use the hostname "db" to connect to the PostgreSQL Docker container
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)

# generate fake data for user table
with Session(engine) as session:
    for _ in range(100):  # generate 100 fake users
        fake_user = User(
            username=fake.name(),
            email=fake.email(),
            hashed_password=fake.password(),
            # add more fields if your User model has more
        )
        session.add(fake_user)
    session.commit()
