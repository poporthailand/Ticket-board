from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import ticket_collection
from django.views import View
from django.middleware.csrf import get_token
import json
from bson import ObjectId
from datetime import datetime

# Create your views here.
class CsrfTokenView(View):
    def get(self, request):
        token = get_token(request)
        return JsonResponse({'csrfToken': token})

class TicketListView(View):
    def get(self, request):
        tickets = list(ticket_collection.find())
        for ticket in tickets:
            ticket['_id'] = str(ticket['_id'])
        sorted_tickets = sorted(tickets, key=lambda x: x['updated_at'], reverse=True)
        return JsonResponse({"tickets": sorted_tickets})

class TicketCreateView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            insert_ticket = {
                "title": data.get("title", None), 
                "description": data.get("description", None), 
                "email": data.get("email", None), 
                "status": data.get("status", None),
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }

            ticket_collection.insert_one(insert_ticket)
            insert_ticket['_id'] = str(insert_ticket['_id'])
            return JsonResponse({"message": "Ticket created successfully", "ticket": insert_ticket }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
class TicketUpdateView(View):
    def put(self, request, ticket_id):
        try:
            data = json.loads(request.body)
            data['updated_at'] = datetime.now()
            ticket_collection.update_one({"_id": ObjectId(ticket_id)}, {"$set": data})
            return JsonResponse({"message": "Ticket updated successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

