import json
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.models import Token

from .models import Exercise, Gym, User, WorkoutEntry, WorkoutSession


def json_body(request):
    try:
        return json.loads(request.body)
    except Exception:
        return {}


def ok(data=None, status=200):
    return JsonResponse({'ok': True, **(data or {})}, status=status)


def err(msg, status=400):
    return JsonResponse({'ok': False, 'error': msg}, status=status)


def get_user_from_request(request):
    """Retrieve user from Authorization: Token <key> header."""
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if auth.startswith('Token '):
        key = auth[6:]
        try:
            return Token.objects.select_related('user').get(key=key).user
        except Token.DoesNotExist:
            pass
    return None


# ── Auth ──────────────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def api_register(request):
    data = json_body(request)
    email = (data.get('email') or '').strip().lower()
    name = (data.get('name') or '').strip()
    password = data.get('password') or ''

    if not email or not name or not password:
        return err('All fields are required.')
    if len(password) < 6:
        return err('Password must be at least 6 characters.')
    if User.objects.filter(email=email).exists():
        return err('This email is already registered.')

    user = User.objects.create_user(username=email, email=email, password=password)
    user.first_name = name
    user.save()

    token, _ = Token.objects.get_or_create(user=user)
    return ok({'token': token.key, 'email': email, 'name': name})


@csrf_exempt
@require_http_methods(['POST'])
def api_login(request):
    data = json_body(request)
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return err('All fields are required.')

    user = authenticate(request, username=email, password=password)
    if user is None:
        return err('Invalid email or password.')

    token, _ = Token.objects.get_or_create(user=user)
    return ok({'token': token.key, 'email': user.email, 'name': user.first_name or user.username})


@csrf_exempt
@require_http_methods(['POST'])
def api_logout(request):
    user = get_user_from_request(request)
    if user:
        Token.objects.filter(user=user).delete()
    return ok()


@require_http_methods(['GET'])
def api_me(request):
    user = get_user_from_request(request)
    if not user:
        return err('Not authenticated.', 401)
    return ok({'email': user.email, 'name': user.first_name or user.username})


@csrf_exempt
@require_http_methods(['POST'])
def api_reset_password(request):
    data = json_body(request)
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    password2 = data.get('password2') or ''

    if not email or not password or not password2:
        return err('All fields are required.')
    if password != password2:
        return err('Passwords do not match.')
    if len(password) < 6:
        return err('Password must be at least 6 characters.')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return err('No account found with this email.')

    user.set_password(password)
    user.save()

    # Issue fresh token
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    return ok({'token': token.key, 'email': email})


# ── Profile ───────────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_profile(request):
    user = get_user_from_request(request)
    if not user:
        return err('Not authenticated.', 401)

    if request.method == 'GET':
        return ok({
            'email': user.email,
            'name': user.first_name or '',
            'surname': user.last_name or '',
        })

    data = json_body(request)
    if 'name' in data:
        user.first_name = data['name']
    if 'surname' in data:
        user.last_name = data['surname']
    user.save()
    return ok()


# ── Exercises ─────────────────────────────────────────────────────────────────

@require_http_methods(['GET'])
def api_exercises(request):
    exs = Exercise.objects.all().values('id', 'name', 'equipment', 'description')
    return JsonResponse({'ok': True, 'exercises': list(exs)})


# ── Gyms ──────────────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_gyms(request):
    if request.method == 'GET':
        gyms = Gym.objects.all().values('id', 'name', 'address', 'color')
        return JsonResponse({'ok': True, 'gyms': list(gyms)})

    user = get_user_from_request(request)
    if not user:
        return err('Not authenticated.', 401)

    data = json_body(request)
    name = (data.get('name') or '').strip()
    if not name:
        return err('Gym name is required.')

    gym, created = Gym.objects.get_or_create(
        name=name,
        defaults={
            'address': data.get('address') or '',
            'color': data.get('color') or '',
        }
    )
    if not created:
        gym.address = data.get('address') or gym.address
        gym.color = data.get('color') or gym.color
        gym.save()

    return ok({'id': gym.id, 'name': gym.name}, status=201 if created else 200)


@csrf_exempt
@require_http_methods(['PUT', 'DELETE'])
def api_gym_detail(request, gym_id):
    user = get_user_from_request(request)
    if not user:
        return err('Not authenticated.', 401)

    try:
        gym = Gym.objects.get(pk=gym_id)
    except Gym.DoesNotExist:
        return err('Gym not found.', 404)

    if request.method == 'DELETE':
        gym.delete()
        return ok()

    data = json_body(request)
    if 'name' in data:
        gym.name = data['name']
    if 'address' in data:
        gym.address = data['address']
    if 'color' in data:
        gym.color = data['color']
    gym.save()
    return ok()


# ── Workout Sessions ──────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_sessions(request):
    user = get_user_from_request(request)
    if not user:
        return err('Not authenticated.', 401)

    if request.method == 'GET':
        sessions = (
            WorkoutSession.objects
            .filter(user=user)
            .select_related('gym')
            .prefetch_related('entries__exercise')
        )
        result = []
        for s in sessions:
            result.append({
                'id': s.id,
                'date': str(s.date),
                'gym': {'id': s.gym.id, 'name': s.gym.name} if s.gym else None,
                'notes': s.notes,
                'entries': [
                    {
                        'exercise': e.exercise.name,
                        'equipment': e.exercise.equipment,
                        'sets': e.sets,
                        'reps': e.reps,
                        'weight_kg': float(e.weight_kg) if e.weight_kg is not None else None,
                        'notes': e.notes,
                    }
                    for e in s.entries.all()
                ],
            })
        return JsonResponse({'ok': True, 'sessions': result})

    # POST — save a training session
    data = json_body(request)
    date_str = data.get('date')
    gym_name = data.get('gym') or ''
    notes = data.get('notes') or ''
    entries = data.get('entries') or []

    if not date_str:
        return err('Date is required.')

    gym = None
    if gym_name:
        gym = Gym.objects.filter(name__iexact=gym_name).first()

    session = WorkoutSession.objects.create(
        user=user,
        gym=gym,
        date=date_str,
        notes=notes,
    )

    for entry in entries:
        ex_name = entry.get('name') or entry.get('exercise')
        if not ex_name:
            continue
        exercise, _ = Exercise.objects.get_or_create(
            name=ex_name,
            defaults={'equipment': entry.get('tag') or 'accessory'}
        )
        reps_val = entry.get('reps') or 0
        try:
            reps_int = int(str(reps_val).split('–')[0].split('-')[0])
        except Exception:
            reps_int = 0

        WorkoutEntry.objects.create(
            session=session,
            exercise=exercise,
            sets=entry.get('sets') or 0,
            reps=reps_int,
            weight_kg=entry.get('weight') if entry.get('weight') else None,
            notes='',
        )

    return ok({'id': session.id}, status=201)
