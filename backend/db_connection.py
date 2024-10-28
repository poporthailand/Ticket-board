from django.conf import settings
from pymongo import MongoClient

client = MongoClient(settings.MONGODB_SETTINGS['host'])
db = client[settings.MONGODB_SETTINGS['db']]

