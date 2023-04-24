from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response 
from .serializers import TasksSerializer
from .models import Tasks
# Create your views here.


@api_view(['GET'])
def start(request):
    api_urls = {
        'List':'/task-list',
        'Detail View':'/task-detail/<id:pk>',
        'Create':'/task-create/',
        'Update':'/task-update/<id:pk>/',
        'Delete':'/task-delete/<id:pk>/',
    }

    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    tasks = Tasks.objects.all().order_by('-id')
    serializer = TasksSerializer(tasks,many=True)
    return Response(serializer.data)


@api_view(['GET'])
def taskDetail(request,pk):
    tasks = Tasks.objects.get(id=pk)
    serializer = TasksSerializer(tasks,many=False)
    return Response(serializer.data)

@api_view(['POST'])
def taskCreate(request):
    serializer = TasksSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
def taskUpdate(request,pk):
    task = Tasks.objects.get(id=pk)
    serializer = TasksSerializer(instance=task,data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request,pk):
    task = Tasks.objects.get(id=pk)
    task.delete()
    return Response('Item Deleted!')