# Generated by Django 3.1.6 on 2021-03-20 07:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPorfolio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alerts', models.JSONField()),
                ('assetEquities', models.JSONField()),
                ('watchedEquities', models.JSONField()),
                ('accountBalance', models.DecimalField(blank=True, db_index=True, decimal_places=2, default=0, help_text='User account balance', max_digits=19, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TradeTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transDate', models.DateTimeField(auto_now_add=True)),
                ('transContent', models.CharField(max_length=255)),
                ('transType', models.CharField(choices=[('plus', 'plus'), ('sub', 'sub')], db_index=True, default='plus', max_length=25)),
                ('amount', models.DecimalField(blank=True, db_index=True, decimal_places=2, default=0, help_text="Transaction's amount", max_digits=19, null=True)),
                ('balance', models.DecimalField(blank=True, db_index=True, decimal_places=2, default=0, help_text='The current balance when transaction was posted', max_digits=19, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]