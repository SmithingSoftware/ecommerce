FROM python:3.9 as py_deps

COPY requirements.txt /requirements.txt

RUN pip install -r requirements.txt

FROM py_deps as api

COPY ecommerce/ /ecommerce/
COPY migrations/ /migrations/
COPY config.py /config.py
COPY wsgi.py /wsgi.py

EXPOSE 5000

ENV FLASK_APP wsgi.py
ENV FLASK_ENV development

CMD [ "flask", "run", "--host=0.0.0.0", "--port=5000" ]
