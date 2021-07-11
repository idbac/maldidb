from django import forms
from chat.models import *
from spectra.models import *
from files.models import UserFile
from dal import autocomplete
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils.crypto import get_random_string # random library
User = get_user_model()

class SpectraCollectionsForm(forms.ModelForm):
  '''
    metadata [kingdom, ..., species], strain_id
    [lab, library]
  '''
  cKingdom = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Kingdom',
    widget = autocomplete.ModelSelect2Multiple(
	    url = 'spectra_search:metadata_autocomplete_kingdom')) # attrs = {'class': 'form-check-input'}
  cPhylum = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Phylum',
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_phylum', forward=('cKingdom',))
  )
  cClass = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Class',
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_class', forward=['cKingdom','cPhylum'])
  )
  cOrder = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Order',
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_order', forward=['cKingdom','cPhylum','cClass'])
  )
  cGenus = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Genus',
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_genus', forward=['cKingdom','cPhylum','cClass','cOrder'])
  )
  cSpecies = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Species',
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_species', forward=['cKingdom','cPhylum','cClass','cOrder','cGenus'])
  )
  
  class Meta:
    model = Metadata
    fields = ['cKingdom', 'cPhylum', 'cClass', 'cOrder', 'cGenus', 'cSpecies']
    # ~ widgets = {
      # ~ 'cGenus': autocomplete.ModelSelect2(url = 'chat:metadata_autocomplete'),
      # ~ 'cClass': autocomplete.Select2(url = 'chat:metadata_autocomplete'),
      # ~ 'cGenus': autocomplete.ModelSelect2(url = 'chat:metadata_autocomplete'),
      # ~ 'cClass': autocomplete.ModelSelect2(url = 'chat:metadata_autocomplete'),
    # ~ }
  
class SpectraLibraryForm(forms.Form):
  '''Processes the library portion of upload form.
  
  Stores upload files to pass to upload form.
  '''
  file = forms.FileField(
    label = 'Upload one or more files',
    required = True,
    widget = forms.ClearableFileInput(attrs={'multiple': True})
  )
  # ~ save_to_library = forms.BooleanField(
    # ~ required = True,
    # ~ label = 'Save upload(s) to a library? (optional)',
    # ~ widget = forms.CheckboxInput(
      # ~ attrs = {
        # ~ 'class': 'form-check-input'}
    # ~ ),
    # ~ initial = True,
  # ~ )
  # If yes... todo: filter by user's membership and/or public libs
  # ~ lab = forms.ModelChoiceField(
    # ~ queryset = LabGroup.objects.all(),
    # ~ to_field_name = 'lab_name',
    # ~ required = False,
    # ~ widget = forms.Select(
      # ~ attrs = {
        # ~ 'class': 'custom-select'}
    # ~ ),
    # ~ disabled = True,
    # ~ empty_label = 'Select a lab'
  # ~ )
  library_select = forms.ModelChoiceField(
    queryset = Library.objects.all(),#.none(),
    to_field_name = 'title',
    required = False,
    widget = forms.Select(
      attrs = {
        'class': 'custom-select'}
    ),
    empty_label = 'Choose...'
  )
  
  library_create_new = forms.CharField(
    required = False,
    help_text = 'Enter a name for the new library',
    widget = forms.TextInput(
      attrs = {
        'class': 'form-control', 'placeholder': 'Enter a library title ...'}
    )
  )
  library_save_type = forms.CharField(label = '',
    widget = forms.RadioSelect(choices = [
      ('RANDOM', 'Random'),
      ('NEW', 'New'),
      ('EXISTING', 'Existing'),
    ])
  )
  
  preprocess = forms.BooleanField(
    required = True,
    initial = True,
    label = 'Perform spectra preprocessing?',
    disabled = True)

  search_library = forms.ModelChoiceField(
    queryset = Library.objects.all(),
    to_field_name = 'title',
    required = False,
    widget = forms.Select(
      attrs = {
        'class': 'custom-select'}
    ),
    disabled = False,
    # ~ empty_label = 'Select a library to search against'
  )
  search_library_own = forms.ModelChoiceField(
    queryset = Library.objects.all(),
    to_field_name = 'title',
    required = False,
    widget = forms.Select(
      attrs = {
        'class': 'custom-select'}
    ),
    # ~ empty_label = 'Own library'
  )
  search_library_lab = forms.ModelChoiceField( # where user is a member or owner
    queryset = Library.objects.all(),
    to_field_name = 'title',
    required = False,
    widget = forms.Select(
      attrs = {
        'class': 'custom-select'}
    ),
    # ~ empty_label = 'Lab library'
  )
  search_library_public = forms.ModelChoiceField(
    queryset = Library.objects.all(),
    to_field_name = 'title',
    required = False,
    widget = forms.Select(
      attrs = {
        'class': 'custom-select'}
    ),
    # ~ empty_label = 'Public library'
  )
  library_search_type = forms.CharField(label = '',
    required = False,
    widget = forms.RadioSelect(choices = [
      ('r01', 'R01 datasets'),
      ('own', 'Own datasets'),
      ('lab', 'Lab datasets'),
      ('pub', 'Public datasets'),
    ])
  )
  
  cKingdom = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Kingdom', required = False,
    widget = autocomplete.ModelSelect2Multiple(
	    url = 'spectra_search:metadata_autocomplete_kingdom')) # attrs = {'class': 'form-check-input'}
  cPhylum = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Phylum', required = False,
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_phylum',
      forward=('cKingdom',)))
  cClass = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Class', required = False,
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_class',
      forward=['cKingdom','cPhylum']))
  cOrder = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Order', required = False,
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_order',
      forward=['cKingdom','cPhylum','cClass']))
  cGenus = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Genus', required = False,
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_genus',
      forward=['cKingdom','cPhylum','cClass','cOrder']))
  cSpecies = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.all(),
    label = 'Species', required = False,
    widget = autocomplete.ModelSelect2Multiple(
      url = 'spectra_search:metadata_autocomplete_species',
      forward=['cKingdom','cPhylum','cClass','cOrder','cGenus']))
      
  # ~ class Meta:
    # ~ model = UserFile
    # ~ exclude = ('id', 'owner', 'upload_date', 'extension')
    #custom-select
    # ~ widgets = {
      # ~ 'lab': forms.Select(
        # ~ attrs = {'class': 'custom-select'}
      # ~ ),
    # ~ }
  
  def __init__(self, *args, **kwargs):
    request = kwargs.pop('request')
    self.user = request.user
    super(SpectraLibraryForm, self).__init__(*args, **kwargs)
    # ~ user = self.user
    # ~ if request.user.is_authenticated:
      # ~ user_labs = LabGroup.objects \
        # ~ .filter(Q(owners__in = [user]) | Q(members__in = [user]))
      # ~ q = Library.objects.filter( \
        # ~ Q(lab__in = user_labs) | \
        # ~ Q(created_by__exact = user)
      # ~ ).order_by('-id')
      # ~ self.fields['library_select'].queryset = q
    
  def clean(self):
    '''
    Adds "library" key
    '''
    d = super().clean()
    # ~ cleaned_data['cKingdom'] = Metadata.objects.none()
    # ~ d['cKingdom'] = Metadata.objects.filter(cKingdom__exact = 'Bacteria')
    # ~ d['cClass'] = Metadata.objects.filter(cClass__exact = 'Gammaproteobacteria')
    print(f'clean{d}')
    
    # user's lab
    user_lab, created = LabGroup.objects.get_or_create(
      lab_name = self.user.username + '\'s default lab',
      user_default_lab = True,
      owners__in = [self.user])
    if created:
      user_lab.owners.add(self.user)
      user_lab.save()
    
    # validate search library
    if d.get('library_search_type') == 'r01':
      pass
    elif d.get('library_search_type') == 'own':
      d['search_library'] = d['search_library_own']
    elif d.get('library_search_type') == 'lab':
      d['search_library'] = d['search_library_lab']
    elif d.get('library_search_type') == 'pub':
      d['search_library'] = d['search_library_public']
      
    # ~ print(f'cleaned{d}')
    
    # validate upload library
    if d.get('library_save_type') == 'RANDOM':
      title = get_random_string(8)
      # (safe check) Checks random entry doesn't exist
      x = False
      c = 100
      while x is False and c > 0:
        c -= 1
        n = Library.objects.filter(
          created_by = self.user,
          title = title
        )
        if len(n) == 0:
          x = True
          new_lib = Library.objects.create(
            created_by = self.user,
            title = title,
            lab = user_lab,
            privacy_level = 'PR'
          )
          d['library'] = new_lib
    elif d.get('library_save_type') == 'NEW':
      n = Library.objects.filter(
        created_by = self.user,
        title = d.get('library_create_new'),
        lab = user_lab,
        privacy_level = 'PR'
      )
      if len(n) != 0:
        raise forms.ValidationError(
          'Library title already exists!'
        )
      else:
        new_lib = Library.objects.create(
          created_by = self.user,
          title = d.get('library_create_new'),
          lab = user_lab,
          privacy_level = 'PR'
        )
        d['library'] = new_lib
    elif d.get('library_save_type') == 'EXISTING':
      d['library'] = d['library_select']
    return d
  
# ~ class SpectraSearchTypeForm(forms.Form):
  # ~ search_library = forms.ModelChoiceField(
    # ~ queryset = Library.objects.all(),
    # ~ to_field_name = 'title',
    # ~ required = True,
    # ~ widget = forms.Select(
      # ~ attrs = {
        # ~ 'class': 'custom-select'}
    # ~ ),
    # ~ disabled = False,
    # ~ empty_label = 'Select a library to search against'
  # ~ )
  
class SpectraUploadForm(forms.ModelForm):
  file = forms.FileField(
    label = 'Upload one or more files',
    required = True,
    widget = forms.ClearableFileInput(attrs={'multiple': True})
  )
  
  upload_count = forms.IntegerField()
  
  # For use with websockets 
  ip = forms.CharField(label = '', required = False)
   
  # ~ library = forms.ModelChoiceField(
    # ~ queryset = Library.objects.none(),
    # ~ to_field_name = 'title',
    # ~ required = True#,
    # ~ widget = forms.Select(
      # ~ attrs = {
        # ~ 'class': 'custom-select'}
    # ~ ),
    # ~ disabled = True,
    # ~ empty_label = 'Select a library'
  # ~ )
  
  class Meta:
    model = UserFile
    exclude = ('id', 'owner', 'upload_date', 'extension')
    #custom-select
    widgets = {
      'lab': forms.Select(
        attrs = {'class': 'custom-select'}
      ),
    }
  
  def save(self, commit = True):
    instance = super().save(commit=False)
    if self.request.user.is_authenticated:
      instance.owner = self.request.user
    instance.save(commit)
    return instance
  
  def __init__(self, *args, **kwargs):
    request = kwargs.pop('request')
    self.user = request.user
    # ~ l = False
    # ~ if 'library' in kwargs:
      # ~ l = kwargs.pop('library')
    super(SpectraUploadForm, self).__init__(*args, **kwargs)
    user = self.user
      
class SpectraSearchForm(forms.ModelForm):
  '''Replicated, Collapsed, all
  Small molecule, Protein, all [or range, e.g., 3k-8k]
  Processed spectra, raw spectra (run pipeline?)'''
  
  # ~ prefix = 'fm'
  
  choices = [
    ('collapsed', 'Collapsed Spectra'),
    ('replicate', 'Replicates'),
    ('all', 'All'),
  ]
  replicates = forms.ChoiceField(
    label = 'Spectrum type',
    widget = forms.RadioSelect(choices = choices),
    choices = choices,
    required = True,
    initial = 'collapsed')
  
  choices = [
    ('protein', 'Protein'),
    ('small', 'Small Molecule'),
    ('all', 'All'),
    # ~ ('custom', 'Custom'),
  ]
  spectrum_cutoff = forms.ChoiceField(
    label = 'Spectrum cutoff', 
    widget = forms.RadioSelect,
    choices = choices,
    required = True,
    initial = 'protein')
  # on custom, then allow for a range
  # ~ spectrum_cutoff_low = forms.IntegerField(
    # ~ label = 'Minimum M/Z',
    # ~ min_value = 0, disabled = True,
    # ~ required = False)
  # ~ spectrum_cutoff_high = forms.IntegerField(
    # ~ label = 'Maximum M/Z',
    # ~ min_value = 0, disabled = True,
    # ~ required = False)
  
  choices = [
    ('processed', 'Processed Spectrum'),
    ('raw', 'Raw Spectrum'),
  ]
  preprocessing = forms.ChoiceField(
    label = 'Spectrum state:',
    widget = forms.RadioSelect(choices = choices),
    choices = choices,
    initial = 'processed')
  # on raw, include preprocessing options
  # (todo?)
  
  labXX = forms.ModelMultipleChoiceField(
    queryset = LabGroup.objects.all(),
    to_field_name = "lab_name",
    required = False
  )
  libraryXX = forms.ModelMultipleChoiceField(
    queryset = Library.objects.all(),
    to_field_name = "title",
    required = False
  )
  strain_idXX = forms.ModelMultipleChoiceField(
    queryset = Metadata.objects.order_by('strain_id').distinct('strain_id'),
    to_field_name = "strain_id",
    required = False
  )
  distinct_users = Spectra.objects.order_by('created_by') \
    .values_list('created_by',flat=True).distinct()
  created_byXX = forms.ModelMultipleChoiceField(
    queryset = User.objects.all().filter(id__in = distinct_users),
    to_field_name = "username", 
    required = False
  )
  xml_hashXX = forms.ModelMultipleChoiceField(
    queryset = XML.objects.order_by('xml_hash').distinct('xml_hash'),
    required = False
  )
  
  # ~ def __init__(self, *args, **kwargs):
    # ~ print(f'_init_-args: {args}') # 
    # ~ print(f'_init_-kw:   {kwargs}') # 
    # ~ super(SpectraSearchForm, self).__init__(*args, **kwargs)
  
  def clean(self):
    data = self.cleaned_data
    print('dpm',data.get('peak_mass'))
    s1 = (
      data.get('peak_mass') != '' or data.get('peak_intensity') != '' or data.get('peak_snr') != ''
    )
    s2 = (
      data.get('peak_mass') == '' or data.get('peak_intensity') == '' or data.get('peak_snr') == ''
    )
    if s1 and s2:
      raise forms.ValidationError(
        'Peak mass, intensity, and SNR must be entered!'
      )
    else:
      return data
    
  class Meta:
    '''
    -- jQuery tooltip utilizes data-toggle and title attrs
    -- Multiple select fields need to not be the model, because the model
       expects these to be a single ID, e.g., library, strain_id, lab_name.
    '''
    model = Spectra
    exclude = (
      'id', 'picture', 'description', 'library', 'strain_id', 'lab',
      'created_by', 'xml_hash'
    )
    widgets = {
      'peak_mass': forms.TextInput(
        attrs={'placeholder': '1,2,3', 'class': 'form-control',
          'data-toggle': 'tooltip',
          'title': 'A list of comma separated values, e.g., "1,2,3"'}
      ),
      'peak_intensity': forms.TextInput(
        attrs={'placeholder': '1,2,3', 'class': 'form-control',
          'data-toggle': 'tooltip',
          'title': 'A list of comma separated values, e.g., "1,2,3"'}
      ),
      'peak_snr': forms.TextInput(
        attrs={'placeholder': '1,2,3', 'class': 'form-control',
          'data-toggle': 'tooltip',
          'title': 'A list of comma separated values, e.g., "1,2,3"'}
      ),
      'spectrum_cutoff_low': forms.TextInput(
        attrs={'size': 6, 'placeholder': 'Min. M/Z', 'class': 'form-control'}
      ),
      'spectrum_cutoff_high': forms.TextInput(
        attrs={'size': 6, 'placeholder': 'Max. M/Z', 'class': 'form-control'}
      ),
      'calibration_constants': forms.Textarea(
        attrs={'rows': 1, 'cols': 10, 'placeholder': ''}
      ),
      'v1_tof_calibration': forms.Textarea(
        attrs={'rows': 1, 'cols': 10, 'placeholder': ''}
      ),
      # ~ 'library': forms.SelectMultiple(),
    }
