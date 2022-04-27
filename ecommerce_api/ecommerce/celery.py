from ecommerce import create_app

app = create_app()
celery = app.celery
app.app_context().push()