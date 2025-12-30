from PIL import Image, ImageDraw, ImageFont
import io

def embed_watermark(image_file: bytes, text="© IdentityGuard") -> bytes:
    image = Image.open(io.BytesIO(image_file)).convert("RGBA")
    width, height = image.size

    txt = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt)

    font_size = max(20, width // 20)
    try:
        font = ImageFont.truetype("Times New Roman Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = (width - text_width - 10, height - text_height - 10)
    draw.text(position, text, fill=(0, 0, 0, 50), font=font)

    watermarked = Image.alpha_composite(image, txt).convert("RGB")

    output = io.BytesIO()
    watermarked.save(output, format="JPEG")
    return output.getvalue()