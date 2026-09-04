# Run ProofRoute backend with the ML package connected.
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:PYTHONPATH = "$projectRoot\backend;$projectRoot\ml"

python -m uvicorn app.main:app `
  --app-dir "$projectRoot\backend" `
  --host 127.0.0.1 `
  --port 8000 `
  --reload
