from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with required email."""

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f"{self.username} ({self.email})"


class Gym(models.Model):
    """A gym location where workouts take place."""

    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    color = models.CharField(max_length=20, blank=True, help_text="Display color, e.g. '#ff5733'")

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Exercise(models.Model):
    """A type of exercise (e.g. Bench Press, Squat)."""

    class EquipmentTag(models.TextChoices):
        BAR = 'bar', 'Barbell'
        DUMBBELL = 'dumbbell', 'Dumbbell'
        PULLEY = 'pulley', 'Pulley / Cable'
        ACCESSORY = 'accessory', 'Accessory'

    name = models.CharField(max_length=100, unique=True)
    equipment = models.CharField(
        max_length=20,
        choices=EquipmentTag.choices,
        default=EquipmentTag.BAR,
    )
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.equipment})"


class WorkoutSession(models.Model):
    """A single gym visit / training session."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    gym = models.ForeignKey(Gym, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        gym_name = self.gym.name if self.gym else 'Unknown gym'
        return f"{self.user.username} @ {gym_name} on {self.date}"


class WorkoutEntry(models.Model):
    """One exercise set block within a workout session."""

    session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='entries')
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT, related_name='entries')
    sets = models.PositiveSmallIntegerField(default=1)
    reps = models.PositiveSmallIntegerField(default=1)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        order_with_respect_to = 'session'

    def __str__(self):
        weight = f"{self.weight_kg} kg" if self.weight_kg else "bodyweight"
        return f"{self.exercise.name}: {self.sets}×{self.reps} @ {weight}"
