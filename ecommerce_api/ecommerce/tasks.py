from flask import current_app as app

task = app.celery.task


@task
def add(x, y):
    print("Adding {} and {}".format(x, y))
    return x + y
