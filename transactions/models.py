from django.db import models
from categories.models import Category


class Transaction(models.Model):
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    label = models.ForeignKey(Category, on_delete=models.CASCADE)
    type = models.CharField(max_length=8, choices=(('Expenses', 'Expenses'),
                                                   ('Income', 'Income'),)
                            )
    date = models.DateField()
    information = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.amount} | {self.label}'
