from orchestrator import run_pipeline
import json

if __name__ == "__main__":

    # 🔥 Change this input anytime
    domain = "healthcare"

    print("\n🚀 Testing Full Pipeline...\n")

    result = run_pipeline(domain)

    print("\n✅ FINAL OUTPUT:\n")
    print(json.dumps(result, indent=2))