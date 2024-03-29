from django.urls import path, include
from . import views
app_name = 'spectra_search'

# ~ from rest_framework.routers import SimpleRouter
# ~ from .views import CollapsedCosineScoreViewSet
# ~ router = SimpleRouter()
# ~ router.register('ccs', CollapsedCosineScoreViewSet)

urlpatterns = [
  # basic / advanced search
  path('', views.FilteredSpectraSearchListView.as_view(), name='basic_search'),
  path('ajax_upload_library/', views.ajax_upload_library, name='ajax_upload_library'),
  path('ajax_upload/', views.ajax_upload, name='ajax_upload'),
  path('ajax_upload_metadata/', views.ajax_upload_metadata, name='ajax_upload_metadata'),
  # Search result
  path('spectra/', views.FilteredSpectraListView.as_view(), name='spectra_results'),
  path('spectra2/', views.FilteredCollapsedSpectraListView.as_view(), name='spectra_results2'),
  
  path('metadata_autocomplete_kingdom/',
    views.MetadataAutocomplete.as_view(view='cKingdom'),
    name='metadata_autocomplete_kingdom'),
  path('metadata_autocomplete_phylum/',
    views.MetadataAutocomplete.as_view(view='cPhylum'),
    name='metadata_autocomplete_phylum'),
  path('metadata_autocomplete_class/',
    views.MetadataAutocomplete.as_view(view='cClass'),
    name='metadata_autocomplete_class'),
  path('metadata_autocomplete_order/',
    views.MetadataAutocomplete.as_view(view='cOrder'),
    name='metadata_autocomplete_order'),
  path('metadata_autocomplete_genus/',
    views.MetadataAutocomplete.as_view(view='cGenus'),
    name='metadata_autocomplete_genus'),
  path('metadata_autocomplete_species/',
    views.MetadataAutocomplete.as_view(view='cSpecies'),
    name='metadata_autocomplete_species'),
  
  # ~ path(
    # ~ 'metadata_autocomplete/',
    # ~ views.MetadataAutocomplete.as_view(),
    # ~ name = 'metadata_autocomplete',
    # ~ ),
]
