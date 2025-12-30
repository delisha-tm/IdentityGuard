from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from models.deepfake_detector import DeepfakeDetector
from models.similarity_checker import SimilarityChecker
from models.watermarker import embed_watermark
from models.phishing_detector import PhishingDetector
from pydantic import BaseModel
import io

deepfake_detector = DeepfakeDetector()
similarity_checker = SimilarityChecker()
phishing_detector = PhishingDetector()

class EmailRequest(BaseModel):
    email_text: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/detect_deepfake")
async def detect_deepfake(file: UploadFile = File(...)):
    try:
        result = deepfake_detector.predict_image(file.file)
        return result
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/embed_watermark")
async def embed_watermark_endpoint(file: UploadFile = File(...), watermark_text: str = "© IdentityGuard"):
    img_bytes = await file.read()
    watermarked_bytes = embed_watermark(img_bytes, watermark_text)
    return StreamingResponse(io.BytesIO(watermarked_bytes), media_type="image/jpeg")

@app.post("/style_similarity")
async def style_similarity(candidate_file: UploadFile = File(...), sample_files: list[UploadFile] = File(...)):
    candidate_bytes = await candidate_file.read()
    samples_bytes = [await f.read() for f in sample_files]

    result = similarity_checker.compare(candidate_bytes, samples_bytes)

    return {
        "candidate": candidate_file.filename,
        "samples": [f.filename for f in sample_files],
        "individual_scores": result["individual_scores"],
        "average_similarity": result["average_similarity"]
    }

@app.post("/detect_phishing")
async def detect_phishing(request: EmailRequest):
    try:
        result = phishing_detector.predict(request.email_text)
        return result
    except Exception as e:
        return {"error": str(e)}