import pandas as pd
from sqlalchemy import create_engine

# Load cleaned CSV
df = pd.read_csv("product.csv")

# PostgreSQL connection string
db_url = "postgresql://neondb_owner:npg_irTFIt5lG2ZA@ep-snowy-rain-a4r9g9vy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Create SQLAlchemy engine
engine = create_engine(db_url)

# Upload data to the existing table
df.to_sql("product", engine, if_exists="append", index=False)

print("Data uploaded successfully.")
