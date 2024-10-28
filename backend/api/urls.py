from django.urls import path
from . import views

urlpatterns = [
    path('csrf_token/', views.CsrfTokenView.as_view(), name='csrf_token'),
    path('tickets/', views.TicketListView.as_view(), name='ticket_list'),
    path('create_ticket/', views.TicketCreateView.as_view(), name='ticket_create'),
    path('update_status_ticket/<str:ticket_id>/', views.TicketUpdateView.as_view(), name='ticket_update'),
]