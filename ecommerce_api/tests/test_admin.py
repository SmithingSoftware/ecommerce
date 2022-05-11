def test_admin_not_admin(app, user):
    with app.test_client(user=user) as client:
        response = client.get("/admin")
        breakpoint()
        assert response.status_code == 401