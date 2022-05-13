from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='static/images/')
    type = models.CharField(max_length=8, choices=(('Expenses', 'Expenses'),
                                                   ('Income', 'Income'),)
                            )

    def __str__(self):
        return f'{self.name} | {self.type}'