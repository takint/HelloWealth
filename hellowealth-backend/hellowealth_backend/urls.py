"""
hellowealth_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/

Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# Uncomment next two lines to enable admin:
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from rest_framework import routers, permissions
from hellowealth_backend.api import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

schema_view = get_schema_view(
   openapi.Info(
      title="Hellowealth API",
      default_version='v1',
      description="Hellowealth APIs",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="len13@student.douglascollege.ca"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.IsAuthenticated],
)

urlpatterns = [
    # Uncomment the next line to enable the admin:
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/', include('hellowealth_backend.api.urls')),
    path('api/rest-auth/', include('dj_rest_auth.urls')),
    path('api/rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
