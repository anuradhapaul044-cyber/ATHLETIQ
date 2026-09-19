import unittest
import uuid

from fastapi.testclient import TestClient

from backend.app.main import app


class AdminApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        suffix = uuid.uuid4().hex[:8]
        self.student_username = f"adminstudent{suffix}"
        self.student_password = "strongpassword123"
        self.coach_username = f"admincoach{suffix}"
        self.coach_password = "strongpassword123"
        self.admin_username = f"admincase{suffix}"
        self.admin_password = "strongpassword123"

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

    def test_admin_routes_require_admin_role(self):
        self._register(self.student_username, self.student_password, role="student")
        student_login = self._login(self.student_username, self.student_password)
        student_headers = {"Authorization": "Be" + "arer " + student_login["access_token"]}

        response = self.client.get("/admin/users", headers=student_headers)
        self.assertEqual(response.status_code, 403, response.text)

    def test_admin_can_list_users_and_approve_coach(self):
        self._register(self.student_username, self.student_password, role="student")
        self._register(self.coach_username, self.coach_password, role="coach")
        self._register(self.admin_username, self.admin_password, role="admin")

        admin_login = self._login(self.admin_username, self.admin_password)
        admin_headers = {"Authorization": "Be" + "arer " + admin_login["access_token"]}

        users = self.client.get("/admin/users", headers=admin_headers)
        self.assertEqual(users.status_code, 200, users.text)
        self.assertGreaterEqual(len(users.json()), 3)

        approval = self.client.post(
            f"/admin/verification/{self.coach_username}",
            json={"status": "approved", "reason": "Profile complete and verified"},
            headers=admin_headers,
        )
        self.assertEqual(approval.status_code, 200, approval.text)
        self.assertEqual(approval.json()["status"], "approved")

        queue = self.client.get("/admin/verification", headers=admin_headers)
        self.assertEqual(queue.status_code, 200, queue.text)
        self.assertTrue(any(item["coach_username"] == self.coach_username for item in queue.json()))

    def test_admin_can_manage_shared_opportunities(self):
        self._register(self.admin_username, self.admin_password, role="admin")
        admin_login = self._login(self.admin_username, self.admin_password)
        admin_headers = {"Authorization": "Be" + "arer " + admin_login["access_token"]}

        created = self.client.post(
            "/admin/opportunities",
            json={
                "title": "Regional Talent ID Camp",
                "organization": "Local Sports Board",
                "category": "Competition",
                "sport": "Athletics",
                "location": "Bengaluru",
                "deadline": "2026-10-15",
                "eligibility": "Open to aspiring regional athletes.",
                "description": "A regional selection camp for youth athletes.",
                "action_label": "Apply now",
                "action_url": "https://example.com",
                "status": "Open"
            },
            headers=admin_headers,
        )
        self.assertEqual(created.status_code, 200, created.text)
        item = created.json()
        self.assertEqual(item["title"], "Regional Talent ID Camp")

        student_public = self.client.get("/opportunities")
        self.assertEqual(student_public.status_code, 200, student_public.text)
        titles = [entry["title"] for entry in student_public.json()]
        self.assertIn("Regional Talent ID Camp", titles)

        updated = self.client.put(
            f"/admin/opportunities/{item['id']}",
            json={"status": "Closed", "description": "Updated by admin"},
            headers=admin_headers,
        )
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(updated.json()["status"], "Closed")


if __name__ == "__main__":
    unittest.main()
