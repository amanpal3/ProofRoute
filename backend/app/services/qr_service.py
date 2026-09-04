import base64
import io
import qrcode
from qrcode.constants import ERROR_CORRECT_M
from app.core.config import settings


class QRService:
    @staticmethod
    def generate_verification_url(product_id: str) -> str:
        base_url = settings.PUBLIC_APP_URL.rstrip("/")
        return f"{base_url}/verify/{product_id}"

    @classmethod
    def generate_qr_base64(cls, product_id: str) -> tuple[str, str]:
        url = cls.generate_verification_url(product_id)
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer)
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        
        return url, f"data:image/png;base64,{encoded}"
