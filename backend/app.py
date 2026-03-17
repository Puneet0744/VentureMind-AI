from flask import Flask, request, jsonify
from flask_cors import CORS

from idea_generator import idea_generator
from orchestrator import run_pipeline   # ✅ NEW

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route("/")
def home():
    return "🚀 AI Startup Generator Backend Running"


# 🔹 OLD (keep for testing/debugging)
@app.route("/generate-idea", methods=["POST"])
def generate_idea_route():
    try:
        data = request.json
        industry = data.get("industry")

        if not industry:
            return jsonify({"error": "Industry is required"}), 400

        result = idea_generator(industry)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔥 NEW MAIN ENDPOINT (FULL PIPELINE)
@app.route("/generate-startup", methods=["POST"])
def generate_startup():
    try:
        data = request.json
        domain = data.get("industry")  # keep naming consistent with frontend

        if not domain:
            return jsonify({"error": "Industry/domain is required"}), 400

        print("\n🚀 NEW REQUEST RECEIVED")
        print("Domain:", domain)

        result = run_pipeline(domain)

        return jsonify(result)

    except Exception as e:
        print("API Error:", e)
        return jsonify({
            "error": "Something went wrong",
            "details": str(e)
        }), 500


# Optional compatibility routes for legacy frontend behavior
@app.route("/market-analysis", methods=["POST"])
def market_analysis():
    try:
        data = request.json
        industry = data.get("industry")
        idea = data.get("idea")

        if not industry:
            return jsonify({"error": "Industry is required"}), 400

        # Use full pipeline, then return analysis output only
        pipeline = run_pipeline(industry)
        if "error" in pipeline:
            return jsonify(pipeline), 500

        return jsonify(pipeline.get("analysis", {}))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/competitor-analysis", methods=["POST"])
def competitor_analysis():
    try:
        data = request.json
        industry = data.get("industry")

        if not industry:
            return jsonify({"error": "Industry is required"}), 400

        pipeline = run_pipeline(industry)
        if "error" in pipeline:
            return jsonify(pipeline), 500

        # preserve shape expected by front-end
        return jsonify({"competitors": pipeline.get("analysis", {}).get("competitors", [])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/validate-idea", methods=["POST"])
def validate_idea():
    try:
        data = request.json
        idea_name = data.get("idea_name") or data.get("name") or ""
        description = data.get("description") or data.get("idea") or ""
        industry = data.get("industry") or ""

        if not idea_name or not description:
            return jsonify({"error": "Idea name and description are required"}), 400

        validation_source = industry or idea_name

        circuit = run_pipeline(validation_source)
        if "error" in circuit:
            return jsonify(circuit), 500

        analysis = circuit.get("analysis", {})

        return jsonify({
            "idea_summary": {
                "name": idea_name,
                "description": description,
                "industry": industry,
            },
            "market_study": analysis.get("market_insights") or analysis.get("market_study") or analysis,
            "competitors": analysis.get("competitors") or circuit.get("selected_idea", {}).get("search_keywords") or [],
            "revenue_model": circuit.get("selected_idea", {}).get("revenue_model", "N/A"),
            "go_to_market": circuit.get("selected_idea", {}).get("go_to_market", "N/A"),
            "feasibility_score": analysis.get("feasibility", {}).get("score") or 0,
            "risks": analysis.get("risks") or [],
            "improvement_suggestions": analysis.get("improvements") or analysis.get("suggestions") or "",
            "strategy": analysis.get("why_it_will_succeed") or analysis.get("why_it_will_fail") or "",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)