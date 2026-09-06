FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    fastapi>=0.110.0 \
    uvicorn[standard]>=0.28.0 \
    pydantic>=2.7.0 \
    python-multipart>=0.0.9 \
    httpx>=0.27.0

COPY ml /app/ml

WORKDIR /app

EXPOSE 8001

CMD ["uvicorn", "ml.src.server:app", "--host", "0.0.0.0", "--port", "8001"]
