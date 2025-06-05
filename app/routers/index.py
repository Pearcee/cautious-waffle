
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

router = APIRouter( tags=["index"], prefix="/index")

# router.mount("../app/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="../app/templates")


@router.get("", response_class=HTMLResponse)
async def index():
    return templates.TemplateResponse(
         name="index.html"
    )
    