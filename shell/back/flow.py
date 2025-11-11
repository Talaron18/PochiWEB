from fastapi import FastAPI
app=FastAPI()
@app.get("/pearl/{username}")
async def getPearl(username: str):
    