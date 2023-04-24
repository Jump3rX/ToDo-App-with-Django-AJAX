from . import views
from django.urls import path

urlpatterns = [
    path('',views.start,name='start'),
    path('task-list/',views.taskList,name='task-list'),
    path('task-detail/<int:pk>',views.taskDetail,name='task-detail'),
    path('task-create/',views.taskCreate,name='task-create'),
    path('task-update/<int:pk>',views.taskUpdate,name='task-update'),
    path('task-delete/<int:pk>',views.taskDelete,name='task-delete'),
]