"""
PolicyLens AI — Profile Routes
GET  /api/profile     — Fetch current user's profile
PUT  /api/profile     — Update current user's profile
"""
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, User

logger = logging.getLogger(__name__)

profile_bp = Blueprint("profile", __name__)


# ---------------------------------------------------------------------------
# GET /api/profile — Fetch user profile
# ---------------------------------------------------------------------------
@profile_bp.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Return the authenticated user's full profile."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone or "",
        "address": user.address or "",
        "city": user.city or "",
        "state": user.state or "Uttar Pradesh",
        "aadhaar_last4": user.aadhaar_last4 or "",
        "bio": user.bio or "",
        "created_at": user.created_at.isoformat(),
    }), 200


# ---------------------------------------------------------------------------
# PUT /api/profile — Update user profile
# ---------------------------------------------------------------------------
@profile_bp.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update the authenticated user's profile fields."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # Updatable fields (email and role are NOT editable)
    updatable = ["name", "phone", "address", "city", "state", "aadhaar_last4", "bio"]

    for field in updatable:
        if field in data:
            value = data[field].strip() if isinstance(data[field], str) else data[field]
            setattr(user, field, value)

    db.session.commit()
    logger.info("Profile updated for user %s", user.email)

    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone": user.phone or "",
            "address": user.address or "",
            "city": user.city or "",
            "state": user.state or "",
            "aadhaar_last4": user.aadhaar_last4 or "",
            "bio": user.bio or "",
        }
    }), 200
