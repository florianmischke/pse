from flask import Flask

def create_app():
    application = Flask(__name__)
    # application.config['SECRET_KEY'] = 'BasWYq86osZH5aBLw38l'

    from .views import views

    application.register_blueprint(views, url_prefix='/')

    return application