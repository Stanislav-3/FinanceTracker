# Generated by Django 4.0.4 on 2022-05-21 15:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('type', models.CharField(choices=[('Expenses', 'Expenses'), ('Income', 'Income')], max_length=8)),
                ('date', models.DateField()),
                ('information', models.CharField(max_length=100)),
                ('label', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='categories.category')),
            ],
        ),
    ]
