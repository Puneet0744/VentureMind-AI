from flask import Flask, request, jsonify
from flask_cors import CORS

from idea_generator import idea_generator
from orchestrator import run_pipeline
from analysis import analyze_user_idea

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route("/")
def home():
    return "AI Startup Generator Backend Running"


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

        print("\nNEW REQUEST RECEIVED")
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
        target_customers = data.get("target_customers") or data.get("targetCustomer") or ""
        business_model = data.get("business_model") or data.get("businessModel") or ""

        if not idea_name or not description:
            return jsonify({"error": "Idea name and description are required"}), 400

        analysis = analyze_user_idea(
            idea_name=idea_name,
            description=description,
            industry=industry,
            target_customers=target_customers,
            business_model=business_model,
            scraped_data=None,
        )

        if isinstance(analysis, dict) and analysis.get("error"):
            return jsonify(analysis), 500

        return jsonify({
            "idea_summary": analysis.get("idea_summary", {
                "name": idea_name,
                "description": description,
                "industry": industry,
                "target_customers": target_customers,
                "business_model": business_model,
            }),
            "market_study": analysis.get("market_insights") or analysis.get("market_potential") or analysis.get("market_study") or "No detailed market insights available yet.",
            "competition_level": analysis.get("competition_level"),
            "competitors": analysis.get("competitors") or ["No existing competitors found"],
            "revenue_model": analysis.get("revenue_model") or analysis.get("business_model") or "No clear revenue model found; consider SaaS/subscription, marketplace fees, or freemium upgrades.",
            "go_to_market": analysis.get("go_to_market") or "",
            "feasibility_score": (analysis.get("feasibility", {}).get("score") if isinstance(analysis.get("feasibility"), dict) else analysis.get("feasibility_score")) or 0,
            "strengths": analysis.get("strengths") or [],
            "weaknesses": analysis.get("weaknesses") or [],
            "verdict": analysis.get("verdict") or "",
            "risks": analysis.get("risks") or analysis.get("weaknesses") or [],
            "improvement_suggestions": analysis.get("improvements") or analysis.get("suggestions") or [],
            "strategy": analysis.get("why_it_will_succeed") or analysis.get("why_it_will_fail") or analysis.get("verdict") or "",
            "raw_analysis": analysis,
            "scraped_data": None,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)