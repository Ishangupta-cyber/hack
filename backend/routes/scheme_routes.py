"""
PolicyLens AI — Scheme Matcher Routes (Gemini AI Powered)
POST /api/schemes   — AI-powered scheme matching based on citizen profile
"""
import os
import json
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

logger = logging.getLogger(__name__)

scheme_bp = Blueprint("schemes", __name__)

SYSTEM_PROMPT = """You are "PolicyLens AI Scheme Matcher" — an expert AI assistant specializing in Indian Government Welfare Schemes (Central + State level).

YOUR TASK:
Given a citizen's profile (age, annual income, category, gender, state), return a JSON array of ALL real, currently active Indian government schemes that this citizen is eligible for.

RULES:
1. Only include REAL schemes that are currently active in India (Central or State level) as of 2025-2026.
2. For each scheme, provide:
   - "name": Official scheme name
   - "ministry": Which ministry/department runs it
   - "type": One of ["Scholarship", "Subsidy", "Pension", "Insurance", "Housing", "Employment", "Loan", "Healthcare", "Agriculture", "Education"]
   - "benefit": What the citizen gets (e.g., "₹75,000/year scholarship")
   - "eligibility_summary": One-line summary of why this citizen qualifies
   - "official_url": The real government URL to apply (e.g., myscheme.gov.in link)
   - "match_score": A percentage (0-100) indicating how strongly this citizen matches
3. Sort results by match_score descending (best matches first).
4. Include Central (all-India) schemes AND state-specific schemes if citizen's state is provided.
5. Do NOT invent fake schemes. Only include schemes you are confident actually exist.
6. If income is above 8,00,000/year, exclude BPL-only schemes.
7. If category is SC/ST/OBC, include reservation-specific schemes.
8. If age is below 25, prioritize education/scholarship schemes.
9. If age is above 60, include pension and elderly welfare schemes.
10. Return between 5 and 15 schemes maximum.

RESPONSE FORMAT:
Return ONLY valid JSON. No markdown, no explanation, no extra text, no code fences. Just the JSON array starting with [ and ending with ].
"""


def _get_gemini_model():
    """Lazily initialize and return the Gemini model."""
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not set in environment")
            return None
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        return model
    except Exception as e:
        logger.error("Failed to initialize Gemini: %s", e)
        return None


# ---------------------------------------------------------------------------
# POST /api/schemes — AI-powered scheme matching
# ---------------------------------------------------------------------------
@scheme_bp.route("/api/schemes", methods=["POST"])
@jwt_required()
def match_schemes():
    """Use Gemini AI to find real government schemes matching a citizen's profile."""
    claims = get_jwt()
    if claims.get("role") != "Citizen":
        return jsonify({"error": "Access denied — Citizens only"}), 403

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # Extract citizen profile
    age = data.get("age")
    income = data.get("income")
    category = data.get("category")
    gender = data.get("gender", "Not specified")
    state = data.get("state", "Uttar Pradesh")

    if not all([age, income, category]):
        return jsonify({"error": "age, income, and category are required"}), 400

    user_prompt = f"""Find all eligible government schemes for this citizen:

- Age: {age}
- Annual Family Income: ₹{income}
- Category: {category}
- Gender: {gender}
- State: {state}

Return the JSON array of matching schemes."""

    model = _get_gemini_model()
    if not model:
        return jsonify({"error": "AI service unavailable. GEMINI_API_KEY may not be configured."}), 503

    try:
        response = model.generate_content([SYSTEM_PROMPT, user_prompt])
        raw_text = response.text.strip()
        
        # Clean up markdown code fences if Gemini wraps the response
        if raw_text.startswith("```"):
            lines = raw_text.split("\n")
            # Remove first line (```json) and last line (```)
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw_text = "\n".join(lines)

        schemes = json.loads(raw_text)
        
        logger.info("Gemini returned %d schemes for age=%s income=%s category=%s",
                     len(schemes), age, income, category)
        
        return jsonify({"schemes": schemes, "source": "gemini-ai"}), 200

    except json.JSONDecodeError as e:
        logger.error("Gemini returned invalid JSON: %s", e)
        return jsonify({"error": "AI returned invalid data. Please try again.", "raw": raw_text[:500]}), 500
    except Exception as e:
        logger.error("Gemini API error: %s", e)
        return jsonify({"error": f"AI service error: {str(e)}"}), 500
