import os
from dotenv import load_dotenv
import csv


import interactions

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

bot = interactions.Client(token=TOKEN)


@bot.command(
    name='addgroup',
    description='TE : Add a new group to the database. Each group must be constituted of 2 people and have a subject.',
    options=[
        interactions.Option(
            name="fullname1",
            description="Name of the first student",
            type=interactions.OptionType.STRING,
            required=True
        ),
        interactions.Option(
            name="fullname2",
            description="Name of the second student",
            type=interactions.OptionType.STRING,
            required=True
        ),
        interactions.Option(
            name="subject",
            description="The subject chosen by the students",
            type=interactions.OptionType.STRING,
            required=True
        )
    ])
async def addgroup(ctx: interactions.CommandContext, fullname1: str, fullname2: str, subject: str):
    await ctx.send(f"""Greetings **{fullname1}**, **{fullname2}** ! You have chosen **{subject}** as your subject.
Your request is under process. Please wait a moment.""")
    try:
        with open('./sujets_presentation.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([fullname1, fullname2, subject])
        await ctx.send(f"""Your request has been processed with success.""")
    except Exception as e:
        await ctx.send(f"""An error has occurred. Please try again later.""")


bot.start()
