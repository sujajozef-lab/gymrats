from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Exercise, Gym, User, WorkoutEntry, WorkoutSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'color')
    search_fields = ('name',)


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'equipment')
    list_filter = ('equipment',)
    search_fields = ('name',)


class WorkoutEntryInline(admin.TabularInline):
    model = WorkoutEntry
    extra = 1


@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'gym', 'date', 'created_at')
    list_filter = ('gym', 'date')
    search_fields = ('user__username',)
    inlines = [WorkoutEntryInline]


@admin.register(WorkoutEntry)
class WorkoutEntryAdmin(admin.ModelAdmin):
    list_display = ('exercise', 'session', 'sets', 'reps', 'weight_kg')
    list_filter = ('exercise__equipment',)
    search_fields = ('exercise__name', 'session__user__username')
