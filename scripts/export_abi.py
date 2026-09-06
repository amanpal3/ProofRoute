import json
from pathlib import Path

def main():
    root = Path(__file__).resolve().parent.parent
    artifact_path = root / "contracts" / "out" / "ProofRouteRegistry.sol" / "ProofRouteRegistry.json"
    frontend_out = root / "frontend" / "src" / "lib" / "contracts.ts"

    if not artifact_path.exists():
        print(f"Artifact not found at {artifact_path}")
        return

    with open(artifact_path, "r", encoding="utf-8") as f:
        artifact = json.load(f)

    abi = artifact.get("abi", [])

    ts_content = f"""// Auto-generated ABI from ProofRouteRegistry.sol build artifacts
export const PROOFROUTE_REGISTRY_ABI = {json.dumps(abi, indent=2)} as const;

export const PROOFROUTE_REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${{string}}`) ||
  "0x0000000000000000000000000000000000000000";

export enum BlockchainStatus {{
  CREATED = 0,
  IN_TRANSIT = 1,
  DELIVERED = 2,
}}
"""
    with open(frontend_out, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Successfully generated {frontend_out} with {len(abi)} ABI items.")

if __name__ == "__main__":
    main()
