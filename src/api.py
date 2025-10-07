from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from .generator import DataGenerator

app = FastAPI(title="Fake Danish Data Generator")
generator = DataGenerator()

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("frontend/index.html", "r") as f:
        return f.read()