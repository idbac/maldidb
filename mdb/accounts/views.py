from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import ProfileForm, RegistrationForm
from .models import UserProfile

User = get_user_model()

def register(request):
  # Redirect if user is already logged in
  if request.user.is_authenticated:
    return redirect(reverse('chat:home'))
  if request.method == 'POST':
    form = RegistrationForm(request.POST)
    # Process POSTed Form data
    if form.is_valid():
      new_user = form.save()
      new_user = authenticate(
        username=request.POST['username'],
        password=request.POST['password1'])
      # authenticate and log user in, then redirect to newsFeeds
      login(request, new_user)
      return redirect(reverse('chat:home'))
  else:
    form = RegistrationForm()
  return render(request, 'registration/register.html', {'form': form})

@login_required
def profile(request, username):
  user = User.objects.get(username=username)
  # check if current_user is already following the user
  is_following = request.user.is_following(user)
  return render(request, 'accounts/users_profile.html', {'user': user, 'is_following': is_following})

@login_required
def edit_profile(request):
  if request.method == "POST":
    # instance kwargs passed in sets the user on the modelForm
    form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
    if form.is_valid():
      form.save()
      return redirect(reverse('accounts:view-profile', args=(request.user.username, )))
  else:
    form = ProfileForm(instance=request.user.profile)
  return render(request, 'accounts/edit_profile.html', {'form': form})

@login_required
def followers(request):
  # Users followed by the current_user
  # In the case that user managed to follow a superuser (e.g., during debug)
  # then disallow showing that.
  users_followed = request.user.followers.exclude(is_superuser=True).all()
  
  # get_users not followed and exclude current_user from the list
  unfollowed_users = User.objects.exclude(
      id__in=users_followed
    ).exclude(
      id=request.user.id
    ).exclude(
      is_superuser=True
    )
  return render(
    request,
    'accounts/followers.html',
    {
    'users_followed': users_followed,
    'unfollowed_users': unfollowed_users
    }
  )

@login_required
def follow(request, username):
  request.user.followers.add(User.objects.get(username=username))
  return redirect('accounts:followers')

@login_required
def unfollow(request, username):
  request.user.followers.remove(User.objects.get(username=username))
  return redirect('accounts:followers')
