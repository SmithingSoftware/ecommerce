from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user


class GatedAdminView(ModelView):
    def is_accessible(self):
      return current_user.is_authenticated and current_user.is_admin


def init_admin(app, db, models):
    admin = Admin(app, name="Ecommerce", template_mode="bootstrap3")
    for model in models:
        admin.add_view(GatedAdminView(model, db.session))
    return admin