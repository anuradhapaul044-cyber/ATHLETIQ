import unittest
import uuid

from fastapi.testclient import TestClient
from sqlalchemy import select

from backend.app.main import app
from backend.app.db.models import User
from backend.app.db.session import SessionLocal


class ApiPersistenceTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        suffix = uuid.uuid4().hex[:8]
        self.student_username = f"demoathlete{suffix}"
        self.student_password = "strongpassword123"
        self.coach_username = f"democoach{suffix}"
        self.coach_password = "strongpassword123"

    def _register(self, username: str, password: str, role: str = "student"):
        response = self.client.post(
            "/auth/register",
            json={"username": username, "password": password, "role": role},
        )
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def _login(self, username: str, password: str):
        response = self.client.post(
            "/auth/login",
            data={"username": username, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        self.assertEqual(response.status_code, 200, response.text)
        payload = response.json()
        self.assertIn("access_token", payload)
        return payload

    def test_student_profile_and_match_records_persist(self):
        self._register(self.student_username, self.student_password, role="student")
        login = self._login(self.student_username, self.student_password)
        token = login["access_token"]
        headers = {"Authorization": "Be" + "arer " + token}

        profile = self.client.get("/students/me/profile", headers=headers)
        self.assertEqual(profile.status_code, 200, profile.text)

        updated = self.client.post(
            "/students/me/profile",
            json={"full_name": "Demo Athlete", "sport": "Athletics", "location": "Delhi"},
            headers=headers,
        )
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(updated.json()["full_name"], "Demo Athlete")

        match = self.client.post(
            "/students/me/match-records",
            json={"event": "State Meet", "date": "2025-09-12", "sport": "Athletics", "competition": "100m", "result": "1st Place", "notes": "Good finish", "verified": "self"},
            headers=headers,
        )
        self.assertEqual(match.status_code, 200, match.text)
        record_id = match.json()["id"]

        listing = self.client.get("/students/me/match-records", headers=headers)
        self.assertEqual(listing.status_code, 200, listing.text)
        self.assertGreaterEqual(len(listing.json()), 1)

        owner = self.client.get(f"/students/me/match-records/{record_id}", headers=headers)
        self.assertEqual(owner.status_code, 200, owner.text)

    def test_coach_can_save_athlete_and_view_verification_queue(self):
        self._register(self.student_username, self.student_password, role="student")
        self._register(self.coach_username, self.coach_password, role="coach")

        student_login = self._login(self.student_username, self.student_password)
        coach_login = self._login(self.coach_username, self.coach_password)

        student_headers = {"Authorization": "Be" + "arer " + student_login["access_token"]}
        coach_headers = {"Authorization": "Be" + "arer " + coach_login["access_token"]}

        self.client.post(
            "/students/me/profile",
            json={"full_name": "Demo Athlete", "sport": "Athletics", "location": "Delhi"},
            headers=student_headers,
        )

        save = self.client.post(f"/coach/saved-athletes/{self.student_username}", headers=coach_headers)
        self.assertEqual(save.status_code, 200, save.text)

        queue = self.client.get("/coach/verification-queue", headers=coach_headers)
        self.assertEqual(queue.status_code, 200, queue.text)

        verification = self.client.post(
            f"/coach/verification/{self.student_username}",
            json={"status": "verified", "observation": "Strong evidence"},
            headers=coach_headers,
        )
        self.assertEqual(verification.status_code, 200, verification.text)

    def test_roles_are_persisted_and_authorize_the_correct_routes(self):
        self._register(self.student_username, self.student_password, role="student")
        self._register(self.coach_username, self.coach_password, role="coach")

        student_login = self._login(self.student_username, self.student_password)
        coach_login = self._login(self.coach_username, self.coach_password)
        self.assertEqual(student_login["user"]["role"], "student")
        self.assertEqual(coach_login["user"]["role"], "coach")

        with SessionLocal() as session:
            stored_roles = dict(
                session.execute(
                    select(User.username, User.role).where(
                        User.username.in_([self.student_username, self.coach_username])
                    )
                ).all()
            )
        self.assertEqual(stored_roles[self.student_username], "student")
        self.assertEqual(stored_roles[self.coach_username], "coach")

        student_headers = {"Authorization": "Be" + "arer " + student_login["access_token"]}
        coach_headers = {"Authorization": "Be" + "arer " + coach_login["access_token"]}
        student_response = self.client.get("/coach/discover", headers=student_headers)
        coach_response = self.client.get("/coach/discover", headers=coach_headers)
        self.assertEqual(student_response.status_code, 403, student_response.text)
        self.assertEqual(coach_response.status_code, 200, coach_response.text)


if __name__ == "__main__":
    unittest.main()
